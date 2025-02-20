import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Building2, MapPin, Phone, Mail, Globe, Calendar } from 'lucide-react';
import BusinessLocations from '@/components/business/BusinessLocations';
import type { Business, BusinessLocation } from '@/types/business';
import { format } from 'date-fns';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BusinessDetailsPage({ params }: PageProps) {
  const supabase = createServerComponentClient({ cookies });
  const { id } = await params;

  // Fetch business details
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('*, business_contacts(*)')
    .eq('id', id)
    .single();

  if (businessError) {
    console.error('Error fetching business:', businessError);
    throw new Error('Failed to fetch business details');
  }

  if (!business) {
    notFound();
  }

  // Fetch business locations
  const { data: locations, error: locationsError } = await supabase
    .from('business_locations')
    .select('*')
    .eq('business_id', id)
    .order('is_primary', { ascending: false });

  if (locationsError) {
    console.error('Error fetching locations:', locationsError);
    throw new Error('Failed to fetch business locations');
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-3 space-y-4 animate-fadeIn">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1.5 text-xs text-gray-500">
        <Link href="/internal/businesses" className="hover:text-egyptian-blue transition-colors">
          Businesses
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-medium">{business.name}</span>
      </nav>

      {/* Business Header */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900">{business.name}</h1>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                business.status === 'active' 
                  ? 'bg-green-50 text-green-700 border border-green-100'
                  : business.status === 'inactive'
                  ? 'bg-gray-50 text-gray-600 border border-gray-100'
                  : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
              }`}>
                {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
              </span>
            </div>
            
            {business.description && (
              <p className="text-sm text-gray-600 max-w-2xl">{business.description}</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2 max-w-3xl">
              {business.business_code && (
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>Code: <span className="font-medium">{business.business_code}</span></span>
                </div>
              )}
              
              {(business.city || business.state || business.country) && (
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span className="truncate">{[business.city, business.state, business.country].filter(Boolean).join(', ')}</span>
                </div>
              )}
              
              {business.phone && (
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{business.phone}</span>
                </div>
              )}
              
              {business.email && (
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <a href={`mailto:${business.email}`} className="hover:text-egyptian-blue transition-colors">
                    {business.email}
                  </a>
                </div>
              )}
              
              {business.website && (
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Globe className="w-3.5 h-3.5 text-gray-400" />
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:text-egyptian-blue transition-colors">
                    {business.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Created {format(new Date(business.created_at), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Locations */}
      <BusinessLocations 
        business={business as Business} 
        initialLocations={locations as BusinessLocation[] || []} 
      />
    </div>
  );
}
