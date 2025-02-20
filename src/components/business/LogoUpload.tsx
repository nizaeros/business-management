'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, ImagePlus, Loader2 } from 'lucide-react';
import { uploadBusinessLogo, deleteBusinessLogo, FileValidationError } from '@/lib/storage/fileStorage';

interface LogoUploadProps {
  businessId: string;
  type: 'short' | 'full';
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  onError: (error: string) => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

export function LogoUpload({ 
  businessId, 
  type, 
  currentUrl, 
  onUpload, 
  onError,
  onLoadingChange 
}: LogoUploadProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setLoadingState = (isLoading: boolean) => {
    setLoading(isLoading);
    onLoadingChange?.(isLoading);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoadingState(true);
      // Clear the preview immediately to show loading state
      setPreview(null);
      
      const url = await uploadBusinessLogo(businessId, file, type);
      
      // Force a refresh of the image by creating a new URL with timestamp
      const refreshedUrl = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
      setPreview(refreshedUrl);
      onUpload(url); // Send the original URL to parent
    } catch (error) {
      if (error instanceof FileValidationError) {
        onError(error.message);
      } else {
        onError('Failed to upload logo. Please try again.');
        console.error('Logo upload error:', error);
      }
    } finally {
      setLoadingState(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (!preview) return;

    try {
      setLoadingState(true);
      setPreview(null); // Clear preview immediately
      await deleteBusinessLogo(businessId, type);
      onUpload('');
    } catch (error) {
      // Restore the previous preview if deletion fails
      setPreview(currentUrl || null);
      onError('Failed to remove logo. Please try again.');
      console.error('Logo removal error:', error);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-full">
        {preview ? (
          <div className="relative group">
            <Image
              src={preview}
              alt={`${type} logo`}
              width={type === 'short' ? 64 : 200}
              height={type === 'short' ? 64 : 100}
              className="rounded-lg border border-gray-200 object-contain bg-white"
              priority
              unoptimized // Disable Next.js image optimization to prevent caching
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              {loading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    disabled={loading}
                  >
                    <Upload className="w-4 h-4 text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="p-1 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    disabled={loading}
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-full aspect-[2/1] flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed
              ${loading ? 'bg-gray-50 border-gray-300' : 'bg-gray-50/50 border-gray-200 hover:border-primary hover:bg-gray-50'}
              transition-colors`}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {type === 'short' ? 'Upload Icon' : 'Upload Logo'}
                </span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        className="hidden"
        onChange={handleFileSelect}
        disabled={loading}
      />
    </div>
  );
}
