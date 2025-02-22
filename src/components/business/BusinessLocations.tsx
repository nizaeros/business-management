'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';
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
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingLocation, setEditingLocation] = useState<BusinessLocation | null>(null);
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
    console.log('Edit location clicked:', location);
    setEditingLocation({ ...location });
    setIsEditing(location.id);
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

      toast.success('Location created successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to save location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!editingLocation) return;

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Authentication required');
      }

      const { error: updateError } = await supabase
        .from('business_locations')
        .update({
          ...editingLocation,
          updated_at: new Date().toISOString(),
          updated_by: user.id
        })
        .eq('id', editingLocation.id);

      if (updateError) throw updateError;

      // Update locations state
      setLocations(locations.map(loc => 
        loc.id === editingLocation.id ? editingLocation : loc
      ));

      setIsEditing(null);
      setEditingLocation(null);

      toast.success('Location updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update location');
      toast.error('Failed to save location. Please try again.');
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

              <div className="flex items-center gap-4 text-xs text-gray-500">
                {location.phone && (
                  <span>{location.phone}</span>
                )}
                {location.email && (
                  <span>{location.email}</span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleEditLocation(location)}
                  className="text-xs text-gray-500 hover:text-egyptian-blue transition-colors"
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

      {/* Edit Location Modal */}
      {Boolean(isEditing) && editingLocation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Location</h3>
              <button
                onClick={() => {
                  setIsEditing(null);
                  setEditingLocation(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateLocation} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editingLocation.name}
                    onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={editingLocation.phone || ''}
                    onChange={(e) => setEditingLocation({ ...editingLocation, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                <input
                  type="text"
                  value={editingLocation.address_line1}
                  onChange={(e) => setEditingLocation({ ...editingLocation, address_line1: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                <input
                  type="text"
                  value={editingLocation.address_line2 || ''}
                  onChange={(e) => setEditingLocation({ ...editingLocation, address_line2: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={editingLocation.city}
                    onChange={(e) => setEditingLocation({ ...editingLocation, city: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    value={editingLocation.state}
                    onChange={(e) => setEditingLocation({ ...editingLocation, state: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    value={editingLocation.country || ''}
                    onChange={(e) => setEditingLocation({ ...editingLocation, country: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input
                    type="text"
                    value={editingLocation.postal_code || ''}
                    onChange={(e) => setEditingLocation({ ...editingLocation, postal_code: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={editingLocation.email || ''}
                  onChange={(e) => setEditingLocation({ ...editingLocation, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_primary"
                  checked={editingLocation.is_primary}
                  onChange={(e) => setEditingLocation({ ...editingLocation, is_primary: e.target.checked })}
                  className="h-4 w-4 text-egyptian-blue focus:ring-egyptian-blue border-gray-300 rounded"
                />
                <label htmlFor="is_primary" className="ml-2 block text-sm text-gray-700">
                  Set as primary location
                </label>
              </div>

              {error && (
                <div className="text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(null);
                    setEditingLocation(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-egyptian-blue rounded-md hover:bg-egyptian-blue/90 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
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
