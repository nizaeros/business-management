'use client';

import { useCallback, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input, Select } from '@/components/ui/form';
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
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Search businesses..."
            icon={<Search className="h-3.5 w-3.5" />}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3 py-2 text-xs font-medium border rounded-md inline-flex items-center gap-1.5 transition-colors ${
            showFilters 
              ? 'bg-egyptian-blue/5 border-egyptian-blue/20 text-egyptian-blue' 
              : 'bg-gray-50/50 border-gray-200 text-gray-700 hover:bg-gray-100/50'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          Filters
          {Object.keys(filters).length > 0 && (
            <span className="w-2 h-2 rounded-full bg-egyptian-blue" />
          )}
        </button>
      </div>

      {showFilters && (
        <div className="p-3 bg-gray-50/50 border border-gray-200 rounded-md shadow-sm space-y-3 animate-scaleIn">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Type</label>
              <Select
                options={[
                  { value: '', label: 'All Types' },
                  { value: 'headquarters', label: 'Headquarters' },
                  { value: 'branch', label: 'Branch' },
                  { value: 'franchise', label: 'Franchise' }
                ]}
                value={filters.type || ''}
                onChange={(e) => handleFilterChange({
                  ...filters,
                  type: e.target.value as BusinessType || undefined
                })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Status</label>
              <Select
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'suspended', label: 'Suspended' }
                ]}
                value={filters.status || ''}
                onChange={(e) => handleFilterChange({
                  ...filters,
                  status: e.target.value as BusinessStatus || undefined
                })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">City</label>
              <Input
                type="text"
                value={filters.location?.city || ''}
                onChange={(e) => handleFilterChange({
                  ...filters,
                  location: { ...filters.location, city: e.target.value || undefined }
                })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Country</label>
              <Input
                type="text"
                value={filters.location?.country || ''}
                onChange={(e) => handleFilterChange({
                  ...filters,
                  location: { ...filters.location, country: e.target.value || undefined }
                })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setFilters({});
                onFilter({});
              }}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50/50 border border-gray-200 rounded-md hover:bg-gray-100/50 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
