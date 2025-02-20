'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Building2, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Business } from '@/types/business';

interface BusinessCardProps {
  business: Business;
  isLoading?: boolean;
}

export function BusinessCard({ business, isLoading = false }: BusinessCardProps) {
  const router = useRouter();
  const pathname = useRouter();

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

  const handleCardClick = () => {
    router.push(`/internal/businesses/${business.id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      role="article"
      aria-label={`Business card for ${business.name}`}
      className="group cursor-pointer hover:scale-[1.01] transition-transform duration-200"
    >
      <CardContent className="p-5 flex flex-col min-h-[140px]">
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 
              border border-gray-100 group-hover:border-egyptian-blue/20 transition-colors shadow-sm"
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
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-semibold text-gray-900 truncate 
                  group-hover:text-egyptian-blue transition-colors"
                >
                  {business.name}
                </h3>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${statusColors[business.status as keyof typeof statusColors]}`}>
                  {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                </span>
              </div>
              
              {business.business_code && (
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                  <span className="font-medium px-1.5 py-0.5 bg-gray-50 rounded">Code:</span> {business.business_code}
                </p>
              )}
              
              {(business.city || business.state || business.country) && (
                <div className="flex items-center gap-2 mt-2.5 text-xs text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
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
      </CardContent>
    </Card>
  );
}
