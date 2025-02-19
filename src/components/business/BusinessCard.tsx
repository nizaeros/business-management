'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Building2, MapPin } from 'lucide-react';
import type { Business } from '@/types/business';

interface BusinessCardProps {
  business: Business;
  onEdit?: (business: Business) => void;
}

export function BusinessCard({ business, onEdit }: BusinessCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {business.logo_url ? (
            <Image
              src={business.logo_url}
              alt={business.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {business.name}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${
              business.status === 'active' 
                ? 'bg-green-100 text-green-800'
                : business.status === 'inactive'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {business.status}
            </span>
          </div>
          
          {business.business_code && (
            <p className="text-sm text-gray-500 mt-1">
              Code: {business.business_code}
            </p>
          )}
          
          {(business.city || business.state || business.country) && (
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="truncate">
                {[business.city, business.state, business.country]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/internal/businesses/${business.id}/locations`}
            className="text-sm text-egyptian-blue hover:text-egyptian-blue/80"
          >
            View Locations
          </Link>
          <Link
            href={`/internal/businesses/${business.id}/contacts`}
            className="text-sm text-egyptian-blue hover:text-egyptian-blue/80"
          >
            Manage Contacts
          </Link>
        </div>
        
        <button
          onClick={() => onEdit?.(business)}
          className="text-sm text-egyptian-blue hover:text-egyptian-blue/80"
        >
          Edit Business
        </button>
      </div>
    </div>
  );
}
