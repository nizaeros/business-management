'use client';

import { useCallback, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import type { BusinessType, BusinessStatus } from '@/types/business';

interface BusinessSearchProps {
  onSearch: (query: string) => void;
  onFilter: (filters: BusinessFilters) => void;
}

export interface BusinessFilters {
  type?: BusinessType;
  status?: BusinessStatus;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
}

export function BusinessSearch({ onSearch, onFilter }: BusinessSearchProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<BusinessFilters>({});

  const handleFilterChange = useCallback((newFilters: BusinessFilters) => {
    setFilters(newFilters);
    onFilter(newFilters);
  }, [onFilter]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search businesses..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-egyptian-blue focus:border-transparent"
            onChange={(e) => onSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
        >
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Type</label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2"
                onChange={(e) => handleFilterChange({
                  ...filters,
                  type: e.target.value as BusinessType || undefined
                })}
                value={filters.type || ''}
              >
                <option value="">All Types</option>
                <option value="headquarters">Headquarters</option>
                <option value="branch">Branch</option>
                <option value="franchise">Franchise</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2"
                onChange={(e) => handleFilterChange({
                  ...filters,
                  status: e.target.value as BusinessStatus || undefined
                })}
                value={filters.status || ''}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Filter by city"
                onChange={(e) => handleFilterChange({
                  ...filters,
                  location: {
                    ...filters.location,
                    city: e.target.value || undefined
                  }
                })}
                value={filters.location?.city || ''}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Filter by country"
                onChange={(e) => handleFilterChange({
                  ...filters,
                  location: {
                    ...filters.location,
                    country: e.target.value || undefined
                  }
                })}
                value={filters.location?.country || ''}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
