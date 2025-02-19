'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { MapPin, Plus, X } from 'lucide-react';
import type { Business, BusinessLocation } from '@/types/business';

interface BusinessLocationsProps {
  business: Business;
  locations?: BusinessLocation[];
  onLocationAdded?: () => void;
}

export function BusinessLocations({ business, locations = [], onLocationAdded }: BusinessLocationsProps) {
  const supabase = createClientComponentClient();
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('business_locations')
        .insert({
          ...newLocation,
          business_id: business.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Reset form and close modal
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
      setIsAddingLocation(false);
      
      // Notify parent to refresh locations
      if (onLocationAdded) {
        onLocationAdded();
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Locations</h2>
        <button
          type="button"
          onClick={() => setIsAddingLocation(true)}
          className="flex items-center gap-2 px-4 py-2 bg-egyptian-blue text-white rounded-lg hover:bg-egyptian-blue/90"
        >
          <Plus className="w-4 h-4" />
          Add Location
        </button>
      </div>

      {/* Locations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location) => (
          <div
            key={location.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-egyptian-blue/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-egyptian-blue mt-1" />
                <div>
                  <h3 className="font-medium">{location.name}</h3>
                  <p className="text-sm text-gray-600">
                    {location.address_line1}
                    {location.address_line2 && <>, {location.address_line2}</>}
                  </p>
                  <p className="text-sm text-gray-600">
                    {location.city}, {location.state}
                  </p>
                  <p className="text-sm text-gray-600">{location.country}</p>
                </div>
              </div>
              {location.is_primary && (
                <span className="px-2 py-1 text-xs bg-egyptian-blue/10 text-egyptian-blue rounded">
                  Primary
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Location Modal */}
      {isAddingLocation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Location</h3>
              <button
                type="button"
                onClick={() => setIsAddingLocation(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2 bg-red-50 text-red-600 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 w-full p-2 border border-gray-300 rounded"
                    value={newLocation.name}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 w-full p-2 border border-gray-300 rounded"
                    value={newLocation.address_line1}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        address_line1: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full p-2 border border-gray-300 rounded"
                    value={newLocation.address_line2}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        address_line2: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 w-full p-2 border border-gray-300 rounded"
                    value={newLocation.city}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, city: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 w-full p-2 border border-gray-300 rounded"
                    value={newLocation.state}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, state: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 w-full p-2 border border-gray-300 rounded"
                    value={newLocation.country}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, country: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full p-2 border border-gray-300 rounded"
                    value={newLocation.postal_code}
                    onChange={(e) =>
                      setNewLocation({
                        ...newLocation,
                        postal_code: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full p-2 border border-gray-300 rounded"
                    value={newLocation.phone}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="mt-1 w-full p-2 border border-gray-300 rounded"
                    value={newLocation.email}
                    onChange={(e) =>
                      setNewLocation({ ...newLocation, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddingLocation(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-egyptian-blue text-white rounded hover:bg-egyptian-blue/90 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
