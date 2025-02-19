'use client';

import { BusinessForm } from '@/components/business/BusinessForm';

export default function CreateBusinessPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Business</h1>
        <p className="mt-2 text-gray-600">Add a new business to your organization</p>
      </div>

      <BusinessForm />
    </div>
  );
}
