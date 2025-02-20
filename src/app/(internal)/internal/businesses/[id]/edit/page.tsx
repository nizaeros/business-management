import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { BusinessForm } from '@/components/business/BusinessForm';
import type { Business } from '@/types/business';

interface Props {
  params: {
    id: string;
  };
}

export default async function EditBusinessPage({ params }: Props) {
  const supabase = createServerComponentClient({ cookies });

  const { data: business, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    throw error;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Edit Business</h1>
      <BusinessForm initialData={business as Business} />
    </div>
  );
}
