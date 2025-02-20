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
        console.log('New business created:', newBusiness);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBusinessTypeChange = (type: BusinessType) => {
    setFormData(prev => ({
      ...prev,
      business_type: type,
      // Reset parent_business_id when switching to headquarters
      parent_business_id: type === 'headquarters' ? '' : prev.parent_business_id
    }));
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex gap-2 p-3 bg-gray-50/50 rounded-md border border-gray-200">
        <button
          onClick={() => setCurrentStep('basic')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            currentStep === 'basic'
              ? 'bg-egyptian-blue text-white'
              : 'text-gray-600 hover:bg-gray-100/50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          Basic Info
        </button>
        <button
          onClick={() => setCurrentStep('location')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            currentStep === 'location'
              ? 'bg-egyptian-blue text-white'
              : 'text-gray-600 hover:bg-gray-100/50'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          Location
        </button>
      </div>

      {/* Form Content */}
      <div className="bg-gray-50/50 rounded-md border border-gray-200">
        <div className="p-4 space-y-4">
          {currentStep === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Business Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full text-sm bg-white border border-gray-200 rounded-md p-1.5 focus:ring-1 focus:ring-egyptian-blue focus:border-egyptian-blue"
                    placeholder="Enter business name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Registered Name</label>
                  <input
                    type="text"
                    name="registered_name"
                    value={formData.registered_name}
                    onChange={handleChange}
                    className="w-full text-sm bg-white border border-gray-200 rounded-md p-1.5 focus:ring-1 focus:ring-egyptian-blue focus:border-egyptian-blue"
                    placeholder="Enter registered name"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Business Code</label>
                  <input
                    type="text"
                    name="business_code"
                    value={formData.business_code}
                    onChange={handleChange}
                    className="w-full text-sm bg-white border border-gray-200 rounded-md p-1.5 focus:ring-1 focus:ring-egyptian-blue focus:border-egyptian-blue"
                    placeholder="Enter business code"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Business Type</label>
                  <select
                    name="business_type"
                    value={formData.business_type}
                    onChange={(e) => handleBusinessTypeChange(e.target.value as BusinessType)}
                    className="w-full text-sm bg-white border border-gray-200 rounded-md p-1.5 focus:ring-1 focus:ring-egyptian-blue focus:border-egyptian-blue"
                  >
                    <option value="headquarters">Headquarters</option>
                    <option value="branch">Branch</option>
                    <option value="franchise">Franchise</option>
                  </select>
                </div>

                {formData.business_type !== 'headquarters' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-700">Parent Business</label>
                    <select
                      name="parent_business_id"
                      value={formData.parent_business_id}
                      onChange={handleChange}
                      className="w-full text-sm bg-white border border-gray-200 rounded-md p-1.5 focus:ring-1 focus:ring-egyptian-blue focus:border-egyptian-blue"
                    >
                      <option value="">Select parent business</option>
                      {parentBusinesses.map((business) => (
                        <option key={business.id} value={business.id}>
                          {business.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full text-sm bg-white border border-gray-200 rounded-md p-1.5 focus:ring-1 focus:ring-egyptian-blue focus:border-egyptian-blue"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'location' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Address Line 1</label>
                  <input
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleChange}
                    className="w-full text-sm bg-white border border-gray-200 rounded-md p-1.5 focus:ring-1 focus:ring-egyptian-blue focus:border-egyptian-blue"
                    placeholder="Enter address line 1"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Address Line 2</label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleChange}
                    className="w-full text-sm bg-white border border-gray-200 rounded-md p-1.5 focus:ring-1 focus:ring-egyptian-blue focus:border-egyptian-blue"
                    placeholder="Enter address line 2"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full text-sm bg-white border border-gray-200 rounded-md p-1.5 focus:ring-1 focus:ring-egyptian-blue focus:border-egyptian-blue"
                    placeholder="Enter city"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full text-sm bg-white border border-gray-200 rounded-md p-1.5 focus:ring-1 focus:ring-egyptian-blue focus:border-egyptian-blue"
                    placeholder="Enter state"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full text-sm bg-white border border-gray-200 rounded-md p-1.5 focus:ring-1 focus:ring-egyptian-blue focus:border-egyptian-blue"
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50/50">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2 ml-auto">
            {currentStep === 'location' && (
              <button
                type="button"
                onClick={() => setCurrentStep('basic')}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            {currentStep === 'basic' ? (
              <button
                type="button"
                onClick={() => setCurrentStep('location')}
                className="px-3 py-1.5 text-xs font-medium text-white bg-egyptian-blue hover:bg-egyptian-blue/90 rounded-md transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-3 py-1.5 text-xs font-medium text-white bg-egyptian-blue hover:bg-egyptian-blue/90 rounded-md transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Business'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
