'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { BusinessCard } from '@/components/business/BusinessCard';
import { BusinessSearch, type BusinessFilters } from '@/components/business/BusinessSearch';
import type { Business } from '@/types/business';

const ITEMS_PER_PAGE = 12;

export default function BusinessesPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<BusinessFilters>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchBusinesses = useCallback(async (
    searchQuery: string,
    filters: BusinessFilters,
    page: number,
    append: boolean = false
  ) => {
    try {
      let query = supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      // Apply search
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,business_code.ilike.%${searchQuery}%`);
      }

      // Apply filters
      if (filters.type) {
        query = query.eq('business_type', filters.type);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.location?.city) {
        query = query.ilike('city', `%${filters.location.city}%`);
      }
      if (filters.location?.country) {
        query = query.ilike('country', `%${filters.location.country}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setBusinesses(prev => append ? [...prev, ...(data as Business[])] : (data as Business[]));
      setHasMore((data?.length ?? 0) === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchBusinesses(searchQuery, filters, 1, false);
  }, [fetchBusinesses, searchQuery, filters]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleFilter = useCallback((newFilters: BusinessFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBusinesses(searchQuery, filters, nextPage, true);
  }, [fetchBusinesses, page, searchQuery, filters]);

  const handleEdit = useCallback((business: Business) => {
    router.push(`/internal/businesses/${business.id}/edit`);
  }, [router]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-3 space-y-4 animate-fadeIn">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-900">Businesses</h1>
        <button
          onClick={() => router.push('/internal/businesses/create')}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-egyptian-blue hover:bg-egyptian-blue/90 rounded-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Business
        </button>
      </div>

      <BusinessSearch onSearch={handleSearch} onFilter={handleFilter} />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <BusinessCard key={i} isLoading={true} business={{} as Business} />
          ))}
        </div>
      ) : businesses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">No businesses found</div>
          <div className="text-sm text-gray-500">Try adjusting your search or filters</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onEdit={() => handleEdit(business)}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 text-sm font-medium text-egyptian-blue bg-egyptian-blue/5 hover:bg-egyptian-blue/10 rounded-md transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
