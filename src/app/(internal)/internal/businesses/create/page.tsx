'use client';

import { BusinessForm } from '@/components/business/BusinessForm';

export default function CreateBusinessPage() {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Create New Business</h1>
        <p className="mt-1 text-sm text-gray-500">Add a new business to your organization</p>
      </div>

      <BusinessForm />
    </div>
  );
}
