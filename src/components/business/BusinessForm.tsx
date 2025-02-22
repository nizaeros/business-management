'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Building2, MapPin } from 'lucide-react';
import type { Business, BusinessType } from '@/types/business';
import type { PostgrestError } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { LogoUpload } from './LogoUpload';

interface BusinessFormProps {
  initialData?: Partial<Business>;
}

type FormStep = 'basic' | 'location';

const BUSINESS_TYPES = [
  { value: 'global_headquarters', label: 'Global Headquarters' },
  { value: 'regional_headquarters', label: 'Regional Headquarters' },
  { value: 'branch', label: 'Branch' },
  { value: 'franchise', label: 'Franchise' }
] as const;

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
    has_parent: initialData?.has_parent || false,
    parent_business_id: initialData?.parent_business_id || '',
    status: initialData?.status || 'active',
    logo_short_url: initialData?.logo_short_url || '',
    logo_full_url: initialData?.logo_full_url || '',
    // Location fields
    address_line1: initialData?.address_line1 || '',
    address_line2: initialData?.address_line2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    country: initialData?.country || ''
  });

  const [parentBusinesses, setParentBusinesses] = useState<Business[]>([]);
  const [error, setError] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);

  // Load potential parent businesses based on selected business type
  const loadParentBusinesses = useCallback(async () => {
    if (!formData.has_parent) {
      console.log('Not loading parent businesses - has_parent is false');
      setParentBusinesses([]);
      return;
    }

    console.log('Loading parent businesses for type:', formData.business_type);
    
    let query = supabase
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
        created_at,
        created_by,
        updated_at,
        updated_by,
        address_line1,
        address_line2,
        city,
        state,
        country,
        business_locations!inner (
          id,
          name,
          address_line1,
          address_line2,
          city,
          state,
          country,
          postal_code,
          phone,
          email,
          is_primary,
          coordinates,
          operating_hours,
          status,
          created_at,
          created_by,
          updated_at,
          updated_by
        )
      `)
      .eq('status', 'active')
      .eq('business_locations.is_primary', true);
    
    // Filter parent businesses based on business type
    if (formData.business_type === 'regional_headquarters') {
      query = query.eq('business_type', 'global_headquarters');
    } else if (['branch', 'franchise'].includes(formData.business_type)) {
      query = query.in('business_type', ['global_headquarters', 'regional_headquarters']);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error loading parent businesses:', error);
      setError(`Error loading parent businesses: ${error.message}`);
      return;
    }
    
    // Transform the data to match the Business interface
    const transformedData = (data || []).map(business => ({
      ...business,
      // Ensure has_parent is derived from parent_business_id
      has_parent: business.parent_business_id !== null,
      // Ensure logo fields are properly typed
      logo_short_url: business.logo_short_url || null,
      logo_full_url: business.logo_full_url || null
    })) as Business[];
    
    console.log('Loaded parent businesses:', transformedData);
    setParentBusinesses(transformedData);
  }, [supabase, formData.business_type, formData.has_parent]);

  useEffect(() => {
    loadParentBusinesses();
  }, [loadParentBusinesses]);

  // Reset parent selection when business type changes
  useEffect(() => {
    if (formData.business_type === 'global_headquarters') {
      setFormData(prev => ({
        ...prev,
        has_parent: false,
        parent_business_id: ''
      }));
    }
  }, [formData.business_type]);

  useEffect(() => {
    console.log('has_parent changed:', formData.has_parent);
    loadParentBusinesses();
  }, [formData.has_parent, loadParentBusinesses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (logoUploading) {
      toast.error('Please wait for logo upload to complete');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Remove UI-only fields and prepare data for submission
      const { ...dataToSubmit } = formData;
      
      // Ensure business_type is one of the allowed values
      if (!['global_headquarters', 'regional_headquarters', 'branch', 'franchise'].includes(dataToSubmit.business_type)) {
        throw new Error('Invalid business type');
      }

      const submitData = {
        ...dataToSubmit,
        slug: formData.business_code.toLowerCase(),
        // Only include parent_business_id if it has a value
        parent_business_id: formData.parent_business_id || null,
        // Ensure these fields are properly set
        business_type: dataToSubmit.business_type,
        status: dataToSubmit.status || 'active',
        logo_short_url: formData.logo_short_url || null,
        logo_full_url: formData.logo_full_url || null
      };

      console.log('Submitting business data:', submitData);

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
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          });

        if (businessError) {
          console.error('Error details:', businessError);
          throw businessError;
        }
        console.log('New business created:', newBusiness);
        toast.success('Business saved successfully');
        router.push('/internal/businesses');
      } else {
        // For existing business
        const { error } = await supabase
          .from('businesses')
          .update(submitData)
          .eq('id', initialData.id);

        if (error) throw error;
        
        // Only redirect if we're not in the middle of a logo upload
        if (!loading) {
          toast.success('Business saved successfully');
          router.push('/internal/businesses');
        }
      }
    } catch (err) {
      const error = err as PostgrestError;
      setError(`Error creating business: ${error.message}`);
      toast.error('Failed to save business. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    console.log('Form field changed:', e.target.name, value);
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleBusinessTypeChange = (type: BusinessType) => {
    setFormData(prev => ({
      ...prev,
      business_type: type,
      // Reset parent_business_id when switching to headquarters
      parent_business_id: type === 'global_headquarters' ? '' : prev.parent_business_id
    }));
  };

  const handleLogoLoadingChange = (isLoading: boolean) => {
    setLogoUploading(isLoading);
  };

  const handleLogoError = (error: string) => {
    setError(error);
    toast.error(error);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg">
      {/* Form Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {initialData ? 'Edit Business' : 'Create New Business'}
        </h2>
      </div>

      {/* Form Navigation Tabs */}
      <div className="px-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setCurrentStep('basic')}
            className={`${
              currentStep === 'basic'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center space-x-2`}
          >
            <Building2 className="h-5 w-5" />
            <span>Basic Info</span>
          </button>
          
          <button
            type="button"
            onClick={() => setCurrentStep('location')}
            className={`${
              currentStep === 'location'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center space-x-2`}
          >
            <MapPin className="h-5 w-5" />
            <span>Location</span>
          </button>
        </nav>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-6 space-y-6">
          {/* Basic Information */}
          {currentStep === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Business Logos
                  </label>
                  <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Icon (Square Format)
                      </label>
                      <LogoUpload
                        businessId={initialData?.id || 'temp'}
                        type="short"
                        currentUrl={formData.logo_short_url}
                        onUpload={(url) => {
                          setFormData(prev => ({ ...prev, logo_short_url: url }));
                          toast.success('Logo uploaded successfully');
                        }}
                        onError={handleLogoError}
                        onLoadingChange={handleLogoLoadingChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Full Logo
                      </label>
                      <LogoUpload
                        businessId={initialData?.id || 'temp'}
                        type="full"
                        currentUrl={formData.logo_full_url}
                        onUpload={(url) => {
                          setFormData(prev => ({ ...prev, logo_full_url: url }));
                          toast.success('Logo uploaded successfully');
                        }}
                        onError={handleLogoError}
                        onLoadingChange={handleLogoLoadingChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Registered Name</label>
                  <input
                    type="text"
                    name="registered_name"
                    value={formData.registered_name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Code</label>
                  <input
                    type="text"
                    name="business_code"
                    value={formData.business_code}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Type</label>
                  <select
                    name="business_type"
                    value={formData.business_type}
                    onChange={(e) => handleBusinessTypeChange(e.target.value as BusinessType)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  >
                    {BUSINESS_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                {formData.business_type !== 'global_headquarters' && (
                  <div className="col-span-2 space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="has_parent"
                        name="has_parent"
                        checked={formData.has_parent}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="has_parent" className="ml-2 block text-sm text-gray-700">
                        Has Parent Business
                      </label>
                    </div>

                    {formData.has_parent && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Parent Business</label>
                        <select
                          name="parent_business_id"
                          value={formData.parent_business_id}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          required={formData.has_parent}
                        >
                          <option value="">Select Parent Business</option>
                          {parentBusinesses.map(business => {
                            const primaryLocation = business.business_locations?.[0];
                            const locationInfo = primaryLocation
                              ? `${primaryLocation.city}, ${primaryLocation.state}, ${primaryLocation.country}`
                              : 'No location';
                            
                            return (
                              <option key={business.id} value={business.id}>
                                {business.name} - {business.business_type.replace('_', ' ')} ({locationInfo})
                              </option>
                            );
                          })}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                          {parentBusinesses.length === 0 
                            ? 'No available parent businesses found.' 
                            : 'Select a parent business from the list. The business type and location are shown for better identification.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Location Information */}
          {currentStep === 'location' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                  <input
                    type="text"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="rounded-md bg-red-50 p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex justify-between items-center">
            {/* Left side buttons */}
            <button
              type="button"
              onClick={() => router.push('/internal/businesses')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>

            {/* Right side buttons */}
            <div className="flex space-x-4">
              {currentStep === 'location' && (
                <button
                  type="button"
                  onClick={() => setCurrentStep('basic')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Previous
                </button>
              )}
              
              {currentStep === 'basic' && (
                <button
                  type="button"
                  onClick={() => setCurrentStep('location')}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1034A6] border border-transparent rounded-md shadow-sm hover:bg-[#0d2b8b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1034A6]"
                >
                  Next
                </button>
              )}
              
              {currentStep === 'location' && (
                <button
                  type="submit"
                  disabled={loading || logoUploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1034A6] border border-transparent rounded-md shadow-sm hover:bg-[#0d2b8b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1034A6] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Business'}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
