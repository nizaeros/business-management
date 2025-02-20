'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, Users, MapPinned, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Business } from '@/types/business';

interface BusinessCardProps {
  business: Business;
  onEdit?: (business: Business) => void;
  isLoading?: boolean;
}

export function BusinessCard({ business, onEdit, isLoading = false }: BusinessCardProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4 mt-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusColors = {
    active: 'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-gray-50 text-gray-600 border-gray-100',
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-100'
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if the click target is the card itself or its main content
    if ((e.target as HTMLElement).closest('button, a')) return;
    router.push(`/internal/businesses/${business.id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push(`/internal/businesses/${business.id}`);
        }
      }}
      role="article"
      aria-label={`Business card for ${business.name}`}
      className="group cursor-pointer hover:scale-[1.01] transition-transform duration-200"
    >
      <CardContent className="p-4 flex flex-col min-h-[120px]">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 
              border border-gray-100 group-hover:border-egyptian-blue/20 transition-colors"
            >
              {business.logo_url ? (
                <Image
                  src={business.logo_url}
                  alt={`${business.name} logo`}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-medium text-gray-900 truncate 
                  group-hover:text-egyptian-blue transition-colors"
                >
                  {business.name}
                </h3>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${statusColors[business.status as keyof typeof statusColors]}`}>
                  {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                </span>
              </div>
              
              {business.business_code && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <span className="font-medium">Code:</span> {business.business_code}
                </p>
              )}
              
              {(business.city || business.state || business.country) && (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate">
                    {[business.city, business.state, business.country]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-gray-100 mt-4 pt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/internal/businesses/${business.id}/locations`);
            }}
            className="flex items-center justify-center gap-1.5 px-2 py-1 text-xs text-gray-600 
              hover:text-egyptian-blue hover:bg-egyptian-blue/5 rounded transition-colors"
          >
            <MapPinned className="w-3.5 h-3.5" />
            <span>Locations</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/internal/businesses/${business.id}/contacts`);
            }}
            className="flex items-center justify-center gap-1.5 px-2 py-1 text-xs text-gray-600 
              hover:text-egyptian-blue hover:bg-egyptian-blue/5 rounded transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Contacts</span>
          </button>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(business);
              }}
              className="flex items-center justify-center gap-1.5 px-2 py-1 text-xs text-gray-600 
                hover:text-egyptian-blue hover:bg-egyptian-blue/5 rounded transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
