import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import BusinessLocations from '@/components/business/BusinessLocations';
import type { Business, BusinessLocation } from '@/types/business';

export default async function BusinessDetailsPage({
  params
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies });
  const businessId = params.id;

  // Fetch business details
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
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
    .eq('business_id', businessId)
    .order('is_primary', { ascending: false });

  if (locationsError) {
    console.error('Error fetching locations:', locationsError);
    throw new Error('Failed to fetch business locations');
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{business.name}</h1>
        <p className="text-gray-600">{business.description}</p>
      </div>

      <BusinessLocations 
        business={business as Business} 
        initialLocations={locations as BusinessLocation[] || []} 
      />
    </div>
  );
}
