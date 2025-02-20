import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const STORAGE_BUCKETS = {
  PUBLIC: 'public-assets',
  SYSTEM: 'system-private',
  CLIENT: 'client-docs',
  TEMP: 'temp-storage'
} as const;

export const FILE_RULES = {
  logo: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/png', 'image/jpeg', 'image/svg+xml'],
    dimensions: { maxWidth: 2048, maxHeight: 2048 }
  }
};

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileValidationError';
  }
}

export async function validateFile(file: File, rules: typeof FILE_RULES.logo) {
  // Check file size
  if (file.size > rules.maxSize) {
    throw new FileValidationError(`File size must be less than ${rules.maxSize / 1024 / 1024}MB`);
  }

  // Check file type
  if (!rules.allowedTypes.includes(file.type)) {
    throw new FileValidationError(`File type must be one of: ${rules.allowedTypes.join(', ')}`);
  }

  // Check image dimensions
  if (file.type.startsWith('image/')) {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (img.width > rules.dimensions.maxWidth || img.height > rules.dimensions.maxHeight) {
          reject(new FileValidationError(
            `Image dimensions must be less than ${rules.dimensions.maxWidth}x${rules.dimensions.maxHeight}`
          ));
        }
        resolve();
      };
      img.onerror = () => reject(new FileValidationError('Invalid image file'));
      img.src = URL.createObjectURL(file);
    });
  }
}

export async function uploadBusinessLogo(
  businessId: string, 
  file: File, 
  type: 'short' | 'full'
): Promise<string> {
  try {
    const supabase = createClientComponentClient();
    
    // Validate file
    await validateFile(file, FILE_RULES.logo);
    
    // Generate file path
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
    const fileName = `${type}.${fileExt}`;
    const filePath = `businesses/${businessId}/logo/${fileName}`;
    
    // First, delete any existing file
    const { data: files } = await supabase.storage
      .from(STORAGE_BUCKETS.PUBLIC)
      .list(`businesses/${businessId}/logo`);
      
    const existingFile = files?.find(file => file.name.startsWith(`${type}.`));
    if (existingFile) {
      await supabase.storage
        .from(STORAGE_BUCKETS.PUBLIC)
        .remove([`businesses/${businessId}/logo/${existingFile.name}`]);
    }
    
    // Upload new file
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.PUBLIC)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      console.error('Storage upload error:', error);
      throw new Error(`Failed to upload logo: ${error.message}`);
    }
    
    // Get public URL with cache buster
    const timestamp = Date.now();
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKETS.PUBLIC)
      .getPublicUrl(`${filePath}?v=${timestamp}`);
      
    return publicUrl;
  } catch (error) {
    if (error instanceof FileValidationError) {
      throw error;
    }
    console.error('Logo upload error:', error);
    throw new Error('Failed to upload logo. Please try again.');
  }
}

export async function deleteBusinessLogo(
  businessId: string,
  type: 'short' | 'full'
): Promise<void> {
  try {
    const supabase = createClientComponentClient();
    
    // List all files in the logo directory to find the one to delete
    const { data: files, error: listError } = await supabase.storage
      .from(STORAGE_BUCKETS.PUBLIC)
      .list(`businesses/${businessId}/logo`);
      
    if (listError) {
      console.error('Storage list error:', listError);
      throw new Error(`Failed to list logos: ${listError.message}`);
    }
    
    // Find the file that matches our type
    const fileToDelete = files?.find(file => file.name.startsWith(`${type}.`));
    if (!fileToDelete) {
      // No file to delete, just return
      return;
    }
    
    const filePath = `businesses/${businessId}/logo/${fileToDelete.name}`;
    const { error: deleteError } = await supabase.storage
      .from(STORAGE_BUCKETS.PUBLIC)
      .remove([filePath]);
      
    if (deleteError) {
      console.error('Storage delete error:', deleteError);
      throw new Error(`Failed to delete logo: ${deleteError.message}`);
    }
  } catch (error) {
    console.error('Logo deletion error:', error);
    throw new Error('Failed to delete logo. Please try again.');
  }
}
