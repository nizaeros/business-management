import React from 'react';
import { EditBusinessForm } from '@/components/business/EditBusinessForm';

interface Props {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getData(id: string) {
  // In a real app, you might want to fetch initial data here
  // For now, we'll just return the id
  return { id };
}

export default async function EditBusinessPage(props: Props) {
  const data = await getData(props.params.id);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <EditBusinessForm businessId={data.id} />
    </div>
  );
}
