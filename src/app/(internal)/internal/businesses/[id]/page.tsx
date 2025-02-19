import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { BusinessLocations } from '@/components/business/BusinessLocations';
import type { Business, BusinessLocation } from '@/types/business';

export default async function BusinessDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  // Fetch business details
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', params.id)
    .single();

  if (businessError) {
    throw businessError;
  }

  // Fetch business locations
  const { data: locations, error: locationsError } = await supabase
    .from('business_locations')
    .select('*')
    .eq('business_id', params.id)
    .order('is_primary', { ascending: false });

  if (locationsError) {
    throw locationsError;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{business.name}</h1>
        <p className="text-gray-600">
          {business.business_type?.charAt(0).toUpperCase()}
          {business.business_type?.slice(1)}
        </p>
      </div>

      <div className="space-y-8">
        {/* Business Locations Section */}
        <BusinessLocations 
          business={business as Business} 
          locations={locations as BusinessLocation[]} 
        />
      </div>
    </div>
  );
}
