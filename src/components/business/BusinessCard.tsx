'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Building2, MapPin, Users, MapPinned, Edit } from 'lucide-react';
import type { Business } from '@/types/business';

interface BusinessCardProps {
  business: Business;
  onEdit?: (business: Business) => void;
  isLoading?: boolean;
}

export function BusinessCard({ business, onEdit, isLoading = false }: BusinessCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-3 animate-pulse">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 mt-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
          </div>
        </div>
      </div>
    );
  }

  const statusColors = {
    active: 'bg-green-50 text-green-700 border-green-100',
    inactive: 'bg-gray-50 text-gray-600 border-gray-100',
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-100'
  };

  return (
    <div 
      className="group bg-white rounded-md shadow-sm border border-gray-200 p-3 hover:shadow-md hover:border-egyptian-blue/20 transition-all duration-200 relative"
      role="article"
      aria-label={`Business card for ${business.name}`}
    >
      <div className="flex items-start gap-3">
        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 group-hover:border-egyptian-blue/10 transition-colors">
          {business.logo_url ? (
            <Image
              src={business.logo_url}
              alt={`${business.name} logo`}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-egyptian-blue transition-colors">
              {business.name}
            </h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${statusColors[business.status as keyof typeof statusColors]}`}>
              {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
            </span>
          </div>
          
          {business.business_code && (
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <span className="font-medium">Code:</span> {business.business_code}
            </p>
          )}
          
          {(business.city || business.state || business.country) && (
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
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
      
      <div className="mt-2 pt-2 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-1">
          <Link
            href={`/internal/businesses/${business.id}/locations`}
            className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-600 hover:text-egyptian-blue hover:bg-egyptian-blue/5 rounded transition-colors"
          >
            <MapPinned className="w-3.5 h-3.5" />
            <span>Locations</span>
          </Link>
          <Link
            href={`/internal/businesses/${business.id}/contacts`}
            className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-600 hover:text-egyptian-blue hover:bg-egyptian-blue/5 rounded transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Contacts</span>
          </Link>
          <button
            onClick={() => onEdit?.(business)}
            className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-600 hover:text-egyptian-blue hover:bg-egyptian-blue/5 rounded transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      <Link
        href={`/internal/businesses/${business.id}`}
        className="absolute inset-0 rounded-md ring-egyptian-blue focus:ring-1 focus:outline-none"
        aria-label={`View details for ${business.name}`}
      >
        <span className="sr-only">View details</span>
      </Link>
    </div>
  );
}
