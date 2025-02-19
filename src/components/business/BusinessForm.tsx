'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Building2, MapPin } from 'lucide-react';
import type { Business, BusinessType } from '@/types/business';
import type { PostgrestError } from '@supabase/supabase-js';

interface BusinessFormProps {
  initialData?: Partial<Business>;
}

type FormStep = 'basic' | 'location' | 'contacts';

export function BusinessForm({ initialData }: BusinessFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    registered_name: initialData?.registered_name || '',
    business_code: initialData?.business_code || '',
    business_type: initialData?.business_type || 'branch' as BusinessType,
    parent_business_id: initialData?.parent_business_id || '',
    status: initialData?.status || 'active',
    // Location fields
    address_line1: initialData?.address_line1 || '',
    address_line2: initialData?.address_line2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    country: initialData?.country || '',
  });

  const [parentBusinesses, setParentBusinesses] = useState<Business[]>([]);
  const [error, setError] = useState('');

  // Load potential parent businesses
  const loadParentBusinesses = useCallback(async () => {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('business_type', 'headquarters');
    
    if (error) {
      console.error('Error loading parent businesses:', error);
      return;
    }
    
    setParentBusinesses(data);
  }, [supabase]);

  useEffect(() => {
    loadParentBusinesses();
  }, [loadParentBusinesses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        slug: formData.business_code.toLowerCase(),
        // Convert empty string to null for database
        parent_business_id: formData.business_type === 'headquarters' ? null : (formData.parent_business_id || null),
      };

      // For new business
      if (!initialData?.id) {
        const { data: newBusiness, error: businessError } = await supabase
          .rpc('create_business_with_location', {
            business_data: {
              ...submitData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            location_data: {
              name: `${formData.name} - Primary Location`,
              address_line1: formData.address_line1,
              address_line2: formData.address_line2,
              city: formData.city,
              state: formData.state,
              country: formData.country,
              is_primary: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          });

        if (businessError) throw businessError;
      } else {
        // For existing business
        const { error } = await supabase
          .from('businesses')
          .update(submitData)
          .eq('id', initialData.id);

        if (error) throw error;
      }

      router.push('/internal/businesses');
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

  const handleBusinessTypeChange = (type: BusinessType) => {
    setFormData(prev => ({
      ...prev,
      business_type: type,
      // Reset parent_business_id when switching to headquarters
      parent_business_id: type === 'headquarters' ? '' : prev.parent_business_id
    }));
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Business Name *</label>
        <input
          type="text"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-egyptian-blue focus:border-transparent"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Registered Name</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-egyptian-blue focus:border-transparent"
          value={formData.registered_name}
          onChange={(e) => setFormData({ ...formData, registered_name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Business Code *</label>
        <input
          type="text"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-egyptian-blue focus:border-transparent"
          value={formData.business_code}
          onChange={(e) => setFormData({ ...formData, business_code: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Business Type *</label>
        <select
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-egyptian-blue focus:border-transparent"
          value={formData.business_type}
          onChange={(e) => handleBusinessTypeChange(e.target.value as BusinessType)}
        >
          <option value="headquarters">Headquarters</option>
          <option value="branch">Branch</option>
          <option value="franchise">Franchise</option>
        </select>
      </div>

      {formData.business_type !== 'headquarters' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Parent Business *</label>
          <select
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-egyptian-blue focus:border-transparent"
            value={formData.parent_business_id || ''}
            onChange={(e) => setFormData({ ...formData, parent_business_id: e.target.value })}
          >
            <option value="">Select Parent Business</option>
            {parentBusinesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );

  const renderLocation = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Address Line 1 *</label>
        <input
          type="text"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-egyptian-blue focus:border-transparent"
          value={formData.address_line1}
          onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Address Line 2</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-egyptian-blue focus:border-transparent"
          value={formData.address_line2}
          onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">City *</label>
          <input
            type="text"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-egyptian-blue focus:border-transparent"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">State/Province *</label>
          <input
            type="text"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-egyptian-blue focus:border-transparent"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Country *</label>
        <input
          type="text"
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-egyptian-blue focus:border-transparent"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            type="button"
            className={`pb-4 px-2 border-b-2 ${
              currentStep === 'basic'
                ? 'border-egyptian-blue text-egyptian-blue'
                : 'border-transparent text-gray-500'
            }`}
            onClick={() => setCurrentStep('basic')}
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <span>Basic Information</span>
            </div>
          </button>

          <button
            type="button"
            className={`pb-4 px-2 border-b-2 ${
              currentStep === 'location'
                ? 'border-egyptian-blue text-egyptian-blue'
                : 'border-transparent text-gray-500'
            }`}
            onClick={() => setCurrentStep('location')}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Primary Location</span>
            </div>
          </button>
        </nav>
      </div>

      <div className="space-y-8">
        {currentStep === 'basic' && renderBasicInfo()}
        {currentStep === 'location' && renderLocation()}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>

          <div className="flex gap-4">
            {currentStep === 'location' && (
              <button
                type="button"
                onClick={() => setCurrentStep('basic')}
                className="px-6 py-2 border border-egyptian-blue text-egyptian-blue rounded-lg hover:bg-egyptian-blue/10"
              >
                Previous
              </button>
            )}

            {currentStep === 'basic' && (
              <button
                type="button"
                onClick={() => setCurrentStep('location')}
                className="px-6 py-2 bg-egyptian-blue text-white rounded-lg hover:bg-egyptian-blue/90"
              >
                Next
              </button>
            )}

            {currentStep === 'location' && (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-egyptian-blue text-white rounded-lg hover:bg-egyptian-blue/90 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Business'}
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
