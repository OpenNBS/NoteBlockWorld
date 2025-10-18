'use client';

import {
  faEllipsis,
  faFilter,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UPLOAD_CONSTANTS } from '@nbw/config';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { SongPreviewDtoType } from '@nbw/database';

import axiosInstance from '@web/lib/axios';
import LoadMoreButton from '@web/modules/browse/components/client/LoadMoreButton';
import SongCard from '@web/modules/browse/components/SongCard';
import SongCardGroup from '@web/modules/browse/components/SongCardGroup';

interface SearchParams {
  q?: string;
  sort?: string;
  order?: string;
  category?: string;
  uploader?: string;
  limit?: number;
}

interface PageDto<T> {
  content: T[];
  page: number;
  limit: number;
  total: number;
}

interface SongSearchState {
  songs: SongPreviewDtoType[];
  loading: boolean;
  isFilterChange: boolean;
  hasMore: boolean;
  currentPage: number;
  totalResults: number;
}

interface SongSearchActions {
  searchSongs: (params: SearchParams, pageNum: number) => Promise<void>;
  loadMore: (params: SearchParams) => Promise<void>;
}

const initialState: SongSearchState = {
  songs: [],
  loading: true,
  isFilterChange: false,
  hasMore: true,
  currentPage: 1,
  totalResults: 0,
};

export const useSongSearchStore = create<SongSearchState & SongSearchActions>(
  (set, get) => ({
    ...initialState,

    // The core data fetching action
    searchSongs: async (params, pageNum) => {
      // Set loading states. If it's the first page, it's a filter change.
      set({
        loading: true,
        isFilterChange: pageNum === 1 && get().songs.length > 0,
      });

      try {
        const response = await axiosInstance.get<PageDto<SongPreviewDtoType>>(
          '/song',
          { params: { ...params, page: pageNum } },
        );

        const { content, total } = response.data;
        const limit = params.limit || 20;

        set((state) => ({
          // If it's the first page, replace songs. Otherwise, append them.
          songs: pageNum === 1 ? content : [...state.songs, ...content],
          totalResults: total,
          currentPage: pageNum,
          // Check if there are more pages to load
          hasMore: content.length >= limit,
        }));
      } catch (error) {
        console.error('Error searching songs:', error);
        set({ songs: [], hasMore: false, totalResults: 0 }); // Reset on error
      } finally {
        set({ loading: false, isFilterChange: false });
      }
    },

    // Convenience action for loading the next page
    loadMore: async (params) => {
      const { loading, hasMore, currentPage } = get();
      if (loading || !hasMore) return; // Prevent multiple calls

      const nextPage = currentPage + 1;
      await get().searchSongs(params, nextPage);
    },
  }),
);

const SearchSongPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'recent';
  const order = searchParams.get('order') || 'desc';
  const category = searchParams.get('category') || '';
  const uploader = searchParams.get('uploader') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  const {
    songs,
    loading,
    hasMore,
    totalResults,
    isFilterChange,
    searchSongs,
    loadMore,
  } = useSongSearchStore();

  useEffect(() => {
    const params = { q: query, sort, order, category, uploader, limit };
    searchSongs(params, initialPage);
  }, [query, sort, order, category, uploader, initialPage, limit, searchSongs]);

  const updateURL = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    // Reset to page 1 on any filter change
    if (!params.page) {
      newParams.set('page', '1');
    }
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const handleLoadMore = () => {
    const params = { q: query, sort, order, category, uploader, limit };
    loadMore(params);
  };

  if (loading && songs.length === 0) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center gap-4 mb-6'>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className='text-2xl text-zinc-400'
          />
          <h1 className='text-2xl font-bold'>Searching...</h1>
        </div>

        {/* Filter skeletons */}
        <div className='flex flex-wrap gap-4 mb-6'>
          <div className='h-12 w-48 bg-zinc-800 animate-pulse rounded-lg' />
          <div className='h-12 w-32 bg-zinc-800 animate-pulse rounded-lg' />
          <div className='h-12 w-48 bg-zinc-800 animate-pulse rounded-lg' />
        </div>

        <SongCardGroup>
          {Array.from({ length: 12 }).map((_, i) => (
            <SongCard key={i} song={null} />
          ))}
        </SongCardGroup>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 relative'>
      {/* Loading overlay for filter changes */}
      {isFilterChange && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center'>
          <div className='bg-zinc-800 rounded-lg p-6 flex flex-col items-center gap-4 shadow-2xl'>
            <div className='animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full' />
            <p className='text-lg font-semibold'>Updating results...</p>
          </div>
        </div>
      )}

      {/* Search header */}
      <div className='flex items-center gap-4 mb-6'>
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className='text-2xl text-zinc-400'
        />
        <div className='flex-1'>
          <h1 className='text-2xl font-bold'>
            {query ? 'Search Results' : 'Browse Songs'}
          </h1>
          {query && (
            <p className='text-zinc-400'>
              {songs.length > 0
                ? `Found ${totalResults} song${
                    totalResults !== 1 ? 's' : ''
                  } for "${query}"`
                : `No songs found for "${query}"`}
            </p>
          )}
          {!query && songs.length > 0 && (
            <p className='text-zinc-400'>
              Showing {songs.length} of {totalResults} songs
            </p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className='bg-zinc-800/50 rounded-lg p-4 mb-6'>
        <div className='flex items-center gap-2 mb-4'>
          <FontAwesomeIcon icon={faFilter} className='text-zinc-400' />
          <h2 className='text-lg font-semibold'>Filters</h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {/* Category Filter */}
          <div>
            <label className='block text-sm font-medium mb-2 text-zinc-300'>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => updateURL({ category: e.target.value })}
              className='block w-full h-12 rounded-lg bg-zinc-900 border-2 border-zinc-600 hover:border-zinc-500 focus:border-blue-500 focus:outline-none p-2 transition-colors'
            >
              <option value=''>All Categories</option>
              {Object.entries(UPLOAD_CONSTANTS.categories).map(
                ([key, value]: [string, string]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <label className='block text-sm font-medium mb-2 text-zinc-300'>
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => updateURL({ sort: e.target.value })}
              className='block w-full h-12 rounded-lg bg-zinc-900 border-2 border-zinc-600 hover:border-zinc-500 focus:border-blue-500 focus:outline-none p-2 transition-colors'
            >
              <option value='recent'>Most Recent</option>
              <option value='popular'>Most Popular</option>
              <option value='plays'>Most Plays</option>
              <option value='title'>Title</option>
              <option value='uploader'>Uploader</option>
            </select>
          </div>

          {/* Order Filter */}
          <div>
            <label className='block text-sm font-medium mb-2 text-zinc-300'>
              Order
            </label>
            <select
              value={order}
              onChange={(e) => updateURL({ order: e.target.value })}
              className='block w-full h-12 rounded-lg bg-zinc-900 border-2 border-zinc-600 hover:border-zinc-500 focus:border-blue-500 focus:outline-none p-2 transition-colors'
            >
              <option value='desc'>Descending</option>
              <option value='asc'>Ascending</option>
            </select>
          </div>

          {/* Limit Filter */}
          <div>
            <label className='block text-sm font-medium mb-2 text-zinc-300'>
              Results per page
            </label>
            <select
              value={limit}
              onChange={(e) => updateURL({ limit: e.target.value })}
              className='block w-full h-12 rounded-lg bg-zinc-900 border-2 border-zinc-600 hover:border-zinc-500 focus:border-blue-500 focus:outline-none p-2 transition-colors'
            >
              <option value='12'>12</option>
              <option value='20'>20</option>
              <option value='40'>40</option>
              <option value='60'>60</option>
            </select>
          </div>
        </div>

        {/* Active filters display */}
        {(category || uploader) && (
          <div className='flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-700'>
            {category && (
              <button
                onClick={() => updateURL({ category: '' })}
                className='inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors'
              >
                Category:{' '}
                {
                  UPLOAD_CONSTANTS.categories[
                    category as keyof typeof UPLOAD_CONSTANTS.categories
                  ]
                }
                <span className='text-xs'>✕</span>
              </button>
            )}
            {uploader && (
              <button
                onClick={() => updateURL({ uploader: '' })}
                className='inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors'
              >
                By: {uploader}
                <span className='text-xs'>✕</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {songs.length > 0 && (
        <>
          <SongCardGroup>
            {songs.map((song, i) => (
              <SongCard key={`${song.publicId}-${i}`} song={song} />
            ))}
          </SongCardGroup>

          {/* Load more / End indicator */}
          <div className='flex flex-col w-full justify-between items-center mt-8'>
            {loading ? (
              <div className='flex items-center gap-2 text-zinc-400'>
                <div className='animate-spin h-5 w-5 border-2 border-zinc-400 border-t-transparent rounded-full' />
                Loading more songs...
              </div>
            ) : hasMore ? (
              <LoadMoreButton onClick={handleLoadMore} />
            ) : (
              <div className='flex flex-col items-center gap-2 text-zinc-500'>
                <FontAwesomeIcon icon={faEllipsis} className='text-2xl' />
                <p className='text-sm'>You've reached the end</p>
              </div>
            )}
          </div>
        </>
      )}
      {!loading && songs.length === 0 && (
        <div className='text-center py-12 text-zinc-400'>
          <FontAwesomeIcon icon={faMagnifyingGlass} className='text-4xl mb-4' />
          <h2 className='text-xl mb-2'>No songs found</h2>
          <p>
            Try adjusting your search terms or filters, or browse our featured
            songs instead.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchSongPage;
