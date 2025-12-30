'use client';

import {
  faArrowUp19,
  faArrowUp91,
  faArrowUpAZ,
  faArrowUpZA,
  faEllipsis,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { create } from 'zustand';

import { UPLOAD_CONSTANTS, SEARCH_FEATURES, INSTRUMENTS } from '@nbw/config';
import { SongPreviewDtoType } from '@nbw/database';
import axiosInstance from '@web/lib/axios';
import LoadMoreButton from '@web/modules/browse/components/client/LoadMoreButton';
import SongCard from '@web/modules/browse/components/SongCard';
import SongCardGroup from '@web/modules/browse/components/SongCardGroup';
import { DualRangeSlider } from '@web/modules/shared/components/ui/dualRangeSlider';
import MultipleSelector from '@web/modules/shared/components/ui/multipleSelectorProps';

interface SearchParams {
  q?: string;
  sort?: string;
  order?: string;
  category?: string;
  uploader?: string;
  limit?: number;
  noteCountMin?: number;
  noteCountMax?: number;
  durationMin?: number;
  durationMax?: number;
  features?: string;
  instruments?: string;
}

interface PageDto<T> {
  content: T[];
  page: number;
  limit: number;
  total: number;
}

// TODO: importing these enums from '@nbw/database' is causing issues.
// They shouldn't be redefined here.
enum SongSortType {
  RECENT = 'recent',
  RANDOM = 'random',
  PLAY_COUNT = 'playCount',
  TITLE = 'title',
  DURATION = 'duration',
  NOTE_COUNT = 'noteCount',
}

enum SongOrderType {
  ASC = 'asc',
  DESC = 'desc',
}

// TODO: refactor with PAGE_SIZE constant
const PLACEHOLDER_COUNT = 12;

const makePlaceholders = () =>
  Array.from({ length: PLACEHOLDER_COUNT }, () => null);

interface SongSearchState {
  songs: Array<SongPreviewDtoType | null>;
  loading: boolean;
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
  hasMore: true,
  currentPage: 1,
  totalResults: 0,
};

export const useSongSearchStore = create<SongSearchState & SongSearchActions>(
  (set, get) => ({
    ...initialState,

    // The core data fetching action
    searchSongs: async (params, pageNum) => {
      // New search/sort (page 1): reset to placeholders. Load more: append placeholders.
      if (pageNum === 1) {
        set({
          loading: true,
          songs: makePlaceholders(),
          currentPage: 1,
          hasMore: true,
        });
      } else {
        set((state) => ({
          loading: true,
          songs: [...state.songs, ...makePlaceholders()],
        }));
      }

      try {
        const response = await axiosInstance.get<PageDto<SongPreviewDtoType>>(
          '/song',
          { params: { ...params, page: pageNum } },
        );

        const { content, total } = response.data;
        const limit = params.limit || 12;

        set((state) => ({
          // Remove placeholders and add the new results
          songs:
            pageNum === 1
              ? content
              : [...state.songs.filter((s) => s !== null), ...content],
          totalResults: total,
          currentPage: pageNum,
          // Check if there are more pages to load
          hasMore: content.length >= limit,
        }));
      } catch (error) {
        console.error('Error searching songs:', error);
        set({ songs: [], hasMore: false, totalResults: 0 }); // Reset on error
      } finally {
        set({ loading: false });
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

interface SearchHeaderProps {
  query: string;
  loading: boolean;
  songsCount: number;
  totalResults: number;
}

/**
 * Displays the main header for the search page, including the title
 * and a summary of the results found.
 */
const SearchHeader = ({
  query,
  loading,
  songsCount,
  totalResults,
}: SearchHeaderProps) => {
  const isSearch = useMemo(() => query !== '', [query]);

  const title = useMemo(() => {
    if (loading) return '';
    if (isSearch) {
      // TODO: implement this with proper variable substitution for translations
      if (totalResults > 1) {
        return `${totalResults.toLocaleString('en-UK')} results for "${query}"`;
      }
      return `1 result for "${query}"`;
    }
    return 'Browse songs';
  }, [loading, isSearch, query, songsCount, totalResults]);

  return (
    <div className='flex items-center gap-4'>
      <h2 className='text-2xl font-light text-zinc-400 min-w-48 h-8'>
        {title || <Skeleton />}
      </h2>
    </div>
  );
};

interface SearchFiltersProps {
  filters: {
    category: string;
    sort: string;
    order: string;
    limit: number;
    uploader: string;
    noteCountMin: number;
    noteCountMax: number;
    durationMin: number;
    durationMax: number;
    features: string;
    instruments: string;
  };
  onFilterChange: (params: Record<string, string | number>) => void;
}

const SearchFilters = ({ filters, onFilterChange }: SearchFiltersProps) => {
  const {
    category,
    sort,
    order,
    limit,
    uploader,
    noteCountMin,
    noteCountMax,
    durationMin,
    durationMax,
    features,
    instruments,
  } = filters;

  // Helper to parse comma-separated string to array of Option objects
  const parseOptions = (str: string, optionsMap: Record<string, string>) => {
    if (!str) return [];
    return str
      .split(',')
      .filter((v) => v.trim())
      .map((value) => {
        // Find the label by searching in the options map
        const entry = Object.entries(optionsMap).find(
          ([, v]) => v === value.trim(),
        );
        return {
          value: value.trim(),
          label: entry ? entry[0] : value.trim(),
        };
      });
  };

  // Helper to convert array of Option objects to comma-separated string
  const optionsToString = (options: Array<{ value: string; label: string }>) =>
    options.map((opt) => opt.value).join(',');

  return (
    <aside className='bg-zinc-800/50 rounded-lg p-4 sticky top-4 h-fit'>
      <div className='flex items-center gap-2 mb-4'>
        <FontAwesomeIcon icon={faFilter} className='text-zinc-400' />
        <h2 className='text-lg font-semibold'>Filters</h2>
      </div>

      <div className='flex flex-col gap-4'>
        {/* Note Count Filter */}
        <div>
          <label className='block text-sm font-medium mb-2 text-zinc-300'>
            Note Count
          </label>
          <DualRangeSlider
            label={(value) => (value ? `${value} notes` : 'All notes')}
            min={0}
            max={10000}
            step={100}
            value={[noteCountMin, noteCountMax]}
            onValueChange={(value) => {
              const [min, max] = value;
              const params: Record<string, string | number> = {};
              if (min !== 0) params.noteCountMin = min;
              if (max !== 10000) params.noteCountMax = max;
              onFilterChange(params);
            }}
          />
        </div>

        {/* Duration Count Filter */}
        <div>
          <label className='block text-sm font-medium mb-2 text-zinc-300'>
            Duration Count
          </label>
          <DualRangeSlider
            label={(value) => {
              // convert seconds to HH:MM:SS, use hours only if greater than 1 hour
              if (value) {
                const hours = Math.floor(value / 3600);
                const minutes = Math.floor((value % 3600) / 60);
                const seconds = value % 60;
                return `${hours}:${minutes}:${seconds}`;
              }
              return 'All duration';
            }}
            min={0}
            max={10000}
            step={100}
            value={[durationMin, durationMax]}
            onValueChange={(value) => {
              const [min, max] = value;
              const params: Record<string, string | number> = {};
              if (min !== 0) params.durationMin = min;
              if (max !== 10000) params.durationMax = max;
              onFilterChange(params);
            }}
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className='block text-sm font-medium mb-2 text-zinc-300'>
            Category
          </label>
          <MultipleSelector
            value={
              category
                ? category
                    .split(',')
                    .filter((c) => c.trim())
                    .map((c) => {
                      const trimmed = c.trim();
                      const label =
                        UPLOAD_CONSTANTS.categories[
                          trimmed as keyof typeof UPLOAD_CONSTANTS.categories
                        ] || trimmed;
                      return { value: trimmed, label };
                    })
                : []
            }
            onChange={(value) => {
              const categoryValue = optionsToString(value);
              const params: Record<string, string | number> = {};
              if (categoryValue) params.category = categoryValue;
              onFilterChange(params);
            }}
            options={Object.entries(UPLOAD_CONSTANTS.categories).map(
              ([key, value]) => ({ value: key, label: value }),
            )}
            className='block w-full h-fit rounded-lg bg-zinc-900 border-2 border-zinc-600 hover:border-zinc-500 focus:border-blue-500 focus:outline-none p-2 transition-colors'
          />
        </div>

        {/* Feature Filter */}
        <div>
          <label className='block text-sm font-medium mb-2 text-zinc-300'>
            Features
          </label>
          <MultipleSelector
            value={parseOptions(features, SEARCH_FEATURES)}
            onChange={(value) => {
              const featuresValue = optionsToString(value);
              const params: Record<string, string | number> = {};
              if (featuresValue) params.features = featuresValue;
              onFilterChange(params);
            }}
            options={Object.entries(SEARCH_FEATURES).map(([key, value]) => ({
              value: value,
              label: key,
            }))}
            className='block w-full h-fit rounded-lg bg-zinc-900 border-2 border-zinc-600 hover:border-zinc-500 focus:border-blue-500 focus:outline-none p-2 transition-colors'
          />
        </div>

        {/* Instrument Filter */}
        <div>
          <label className='block text-sm font-medium mb-2 text-zinc-300'>
            Instrument
          </label>
          <MultipleSelector
            value={parseOptions(instruments, INSTRUMENTS)}
            onChange={(value) => {
              const instrumentsValue = optionsToString(value);
              const params: Record<string, string | number> = {};
              if (instrumentsValue) params.instruments = instrumentsValue;
              onFilterChange(params);
            }}
            options={Object.entries(INSTRUMENTS).map(([key, value]) => ({
              value: value,
              label: key,
            }))}
            className='block w-full h-fit rounded-lg bg-zinc-900 border-2 border-zinc-600 hover:border-zinc-500 focus:border-blue-500 focus:outline-none p-2 transition-colors'
          />
        </div>
      </div>
    </aside>
  );
};

const NoResults = () => (
  <div className='flex flex-col items-center justify-center gap-4 max-w-52 mx-auto'>
    <Image src='/empty-chest.png' alt='' width={150} height={200} aria-hidden />
    <h3 className='text-2xl w-full'>No songs found</h3>
    <p className='text-zinc-400 text-sm text-wrap'>
      Try adjusting your search terms, or browse our{' '}
      <Link
        href='/'
        className='text-blue-400 hover:underline hover:text-blue-300'
      >
        featured songs
      </Link>{' '}
      instead.
    </p>
  </div>
);

interface SearchResultsProps {
  songs: Array<SongPreviewDtoType | null>;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const SearchResults = ({ songs, hasMore, onLoadMore }: SearchResultsProps) => (
  <>
    <SongCardGroup>
      {songs.map((song, i) => (
        <SongCard
          key={song ? `${song.publicId}-${i}` : `placeholder-${i}`}
          song={song}
        />
      ))}
    </SongCardGroup>

    {/* Load more / End indicator */}
    <div className='flex flex-col w-full justify-between items-center mt-4'>
      {hasMore ? (
        <LoadMoreButton onClick={onLoadMore} />
      ) : (
        <div className='flex flex-col items-center gap-2 text-zinc-500'>
          <FontAwesomeIcon icon={faEllipsis} className='text-2xl' />
        </div>
      )}
    </div>
  </>
);

const SearchSongPage = () => {
  const [queryState, setQueryState] = useQueryStates({
    q: parseAsString.withDefault(''),
    sort: parseAsString.withDefault(SongSortType.RECENT),
    order: parseAsString.withDefault(SongOrderType.DESC),
    category: parseAsString.withDefault(''),
    uploader: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(12),
    noteCountMin: parseAsInteger,
    noteCountMax: parseAsInteger,
    durationMin: parseAsInteger,
    durationMax: parseAsInteger,
    features: parseAsString,
    instruments: parseAsString,
  });

  const {
    q: query,
    sort,
    order,
    category,
    uploader,
    page: currentPageParam,
    limit,
    noteCountMin,
    noteCountMax,
    durationMin,
    durationMax,
    features,
    instruments,
  } = queryState;

  const initialPage = currentPageParam ?? 1;

  const { songs, loading, hasMore, totalResults, searchSongs } =
    useSongSearchStore();

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params: SearchParams = {
      q: query,
      sort,
      order,
      category,
      uploader,
      limit,
      noteCountMin: noteCountMin > 0 ? noteCountMin : undefined,
      noteCountMax: noteCountMax < 10000 ? noteCountMax : undefined,
      durationMin: durationMin > 0 ? durationMin : undefined,
      durationMax: durationMax < 10000 ? durationMax : undefined,
      features: features || undefined,
      instruments: instruments || undefined,
    };
    searchSongs(params, initialPage);
  }, [
    query,
    sort,
    order,
    category,
    uploader,
    initialPage,
    limit,
    noteCountMin,
    noteCountMax,
    durationMin,
    durationMax,
    features,
    instruments,
    searchSongs,
  ]);

  const handleLoadMore = () => {
    setQueryState({ page: (currentPageParam ?? 1) + 1 });
  };

  const handleSortChange = (value: string) => {
    setQueryState({ sort: value, page: 1 });
  };

  const handleOrderChange = () => {
    const newOrder =
      order === SongOrderType.ASC ? SongOrderType.DESC : SongOrderType.ASC;
    setQueryState({ order: newOrder, page: 1 });
  };

  /* Use 19/91 button if sorting by a numeric value, otherwise use AZ/ZA */
  const orderIcon = useMemo(() => {
    if (sort === SongSortType.TITLE) {
      return order === SongOrderType.ASC ? faArrowUpZA : faArrowUpAZ;
    } else {
      return order === SongOrderType.ASC ? faArrowUp19 : faArrowUp91;
    }
  }, [sort, order]);

  return (
    <div className='container mx-auto px-4 py-8 relative'>
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Filters Sidebar */}
        {/* {showFilters && (
          <div className='w-full lg:w-72 shrink-0'>
            <SearchFilters
              filters={{
                category,
                sort,
                order,
                limit,
                uploader,
                noteCountMin,
                noteCountMax,
                durationMin,
                durationMax,
                features,
                instruments,
              }}
              onFilterChange={(params) => updateURL(params)}
            />
          </div>
        )} */}

        {/* Main Content */}
        <div className='flex-1 min-w-0'>
          <div className='flex flex-wrap items-center justify-between gap-4 mb-6'>
            <div className='flex-1 min-w-[260px]'>
              <SearchHeader
                query={query}
                loading={loading}
                songsCount={songs.length}
                totalResults={totalResults}
              />
            </div>
            <div className='flex items-center gap-3'>
              {/* <button
                type='button'
                onClick={() => setShowFilters((prev) => !prev)}
                className='inline-flex items-center gap-2 px-3 py-2 rounded-md border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors text-sm'
              >
                <FontAwesomeIcon icon={faFilter} />
                {showFilters ? 'Hide filters' : 'Show filters'}
              </button> */}
              <div className='flex items-center gap-2'>
                <span className='text-sm text-zinc-400'>Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className='h-10 w-48 rounded-md bg-zinc-900 border-2 border-zinc-600 hover:border-zinc-500 focus:border-blue-500 focus:outline-none px-1.5 text-sm transition-colors'
                >
                  <option value={SongSortType.RECENT}>Recent</option>
                  <option value={SongSortType.PLAY_COUNT}>Popular</option>
                  <option value={SongSortType.TITLE}>Title</option>
                  <option value={SongSortType.DURATION}>Duration</option>
                  <option value={SongSortType.NOTE_COUNT}>Note count</option>
                </select>
              </div>

              {/* Order button */}
              <button
                className='bg-zinc-700 hover:bg-zinc-600 h-10 w-10 rounded-md flex items-center justify-center transition-colors enabled:cursor-pointer'
                onClick={handleOrderChange}
                aria-label={
                  order === SongOrderType.ASC
                    ? 'Sort ascending'
                    : 'Sort descending'
                }
              >
                <FontAwesomeIcon icon={orderIcon} size='1x' />
              </button>
            </div>
          </div>

          {/* Results */}
          {songs.length > 0 && (
            <SearchResults
              songs={songs}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
            />
          )}

          {/* No results */}
          {!loading && songs.length === 0 && <NoResults />}
        </div>
      </div>
    </div>
  );
};

export default SearchSongPage;
