'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { BusinessForm } from '@/components/business/BusinessForm';
import type { Business } from '@/types/business';
import type { PostgrestError } from '@supabase/supabase-js';

type EditBusinessFormProps = {
  businessId: string;
};

export function EditBusinessForm({ businessId }: EditBusinessFormProps) {
  const supabase = createClientComponentClient();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select(`
            id,
            name,
            registered_name,
            business_code,
            business_type,
            has_parent,
            parent_business_id,
            status,
            logo_short_url,
            logo_full_url,
            address_line1,
            address_line2,
            city,
            state,
            country,
            created_at,
            created_by,
            updated_at,
            updated_by
          `)
          .eq('id', businessId)
          .single();

        if (error) throw error;
        setBusiness(data as Business);
      } catch (error) {
        if (error instanceof Error || 'message' in (error as object)) {
          setError((error as Error | PostgrestError).message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [supabase, businessId]);

  if (loading) {
    return (
      <div className="text-center">Loading...</div>
    );
  }

  if (error || !business) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        {error || 'Business not found'}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Business</h1>
        <p className="mt-2 text-gray-600">Update business information for {business.name}</p>
      </div>

      <BusinessForm initialData={business} />
    </div>
  );
}
