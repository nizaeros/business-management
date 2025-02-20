import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { BusinessForm } from '@/components/business/BusinessForm';
import type { Business } from '@/types/business';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBusinessPage({ params }: PageProps) {
  const supabase = createServerComponentClient({ cookies });
  const { id } = await params;

  // Fetch business details
  const { data: business, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Edit Business</h1>
      <BusinessForm initialData={business as Business} />
    </div>
  );
}
