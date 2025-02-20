'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { MapPin, Plus, X } from 'lucide-react';
import { Business, BusinessLocation } from '@/types/business';

interface BusinessLocationsProps {
  business: Business;
  initialLocations: BusinessLocation[];
}

const BusinessLocations = ({ 
  business, 
  initialLocations 
}: BusinessLocationsProps) => {
  const [locations, setLocations] = useState<BusinessLocation[]>(initialLocations);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const [newLocation, setNewLocation] = useState({
    name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    phone: '',
    email: '',
    is_primary: false
  });

  const handleEditLocation = (location: BusinessLocation) => {
    console.log('Edit location:', location);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Authentication required');
      }

      // Prepare location data
      const locationData = {
        ...newLocation,
        business_id: business.id,
        created_by: user.id,
        updated_by: user.id,
        status: 'active' as const
      };

      // If this is the first location or marked as primary, ensure it's set as primary
      if (locations.length === 0 || locationData.is_primary) {
        // If setting this as primary, update all other locations to non-primary
        if (locations.length > 0) {
          const { error: updateError } = await supabase
            .from('business_locations')
            .update({ is_primary: false })
            .eq('business_id', business.id);

          if (updateError) {
            throw new Error('Failed to update primary location status');
          }
        }
      }

      // Insert the new location
      const { data, error: insertError } = await supabase
        .from('business_locations')
        .insert(locationData)
        .select()
        .single();

      if (insertError) {
        throw new Error('Failed to add location');
      }

      // Update local state
      setLocations(prev => [...prev, data]);
      setIsAddingLocation(false);
      
      // Reset form
      setNewLocation({
        name: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        phone: '',
        email: '',
        is_primary: false
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Locations</h2>
        <button
          onClick={() => setIsAddingLocation(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-egyptian-blue 
            bg-egyptian-blue/5 hover:bg-egyptian-blue/10 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Location
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <div
            key={location.id}
            className="relative bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:border-egyptian-blue/20 transition-colors"
          >
            {location.is_primary && (
              <span className="absolute top-2 right-2 px-2 py-0.5 text-[11px] font-medium bg-egyptian-blue/5 
                text-egyptian-blue rounded-full">
                Primary
              </span>
            )}
            
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{location.name}</h3>
                <p className="mt-1 text-xs text-gray-500">
                  {[
                    location.address_line1,
                    location.address_line2,
                    location.city,
                    location.state,
                    location.postal_code,
                    location.country,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  {location.phone && (
                    <span className="text-xs text-gray-500">
                      {location.phone}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleEditLocation(location)}
                  className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-xs text-gray-600 
                    hover:text-egyptian-blue hover:bg-egyptian-blue/5 rounded transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAddingLocation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add New Location</h3>
              <button
                onClick={() => setIsAddingLocation(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={newLocation.phone}
                    onChange={(e) => setNewLocation({ ...newLocation, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                <input
                  type="text"
                  value={newLocation.address_line1}
                  onChange={(e) => setNewLocation({ ...newLocation, address_line1: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                <input
                  type="text"
                  value={newLocation.address_line2}
                  onChange={(e) => setNewLocation({ ...newLocation, address_line2: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={newLocation.city}
                    onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    value={newLocation.state}
                    onChange={(e) => setNewLocation({ ...newLocation, state: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input
                    type="text"
                    value={newLocation.postal_code}
                    onChange={(e) => setNewLocation({ ...newLocation, postal_code: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    value={newLocation.country}
                    onChange={(e) => setNewLocation({ ...newLocation, country: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_primary"
                  checked={newLocation.is_primary}
                  onChange={(e) => setNewLocation({ ...newLocation, is_primary: e.target.checked })}
                  className="rounded border-gray-300 text-egyptian-blue"
                />
                <label htmlFor="is_primary" className="text-sm text-gray-700">
                  Set as primary location
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddingLocation(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-egyptian-blue hover:bg-egyptian-blue/90 
                    rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
};

export default BusinessLocations;
