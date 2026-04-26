'use client';

import { createContext, useContext, useRef } from 'react';
import { createStore, useStore } from 'zustand';

import { BROWSER_SONGS } from '@nbw/config';
import type { PageDto, SongPreviewDtoType } from '@nbw/database';
import axiosInstance from '@web/lib/axios';

interface RecentSongsState {
  recentItems: FeedItem[];
  recentError: string;
  isLoading: boolean;
  hasMore: boolean;
  selectedCategory: string;
  categories: Record<string, number>;
  page: number;
}

interface RecentSongsActions {
  setSelectedCategory: (category: string) => void;
  increasePageRecent: () => Promise<void>;
  fetchRecentSongs: (targetPage?: number) => Promise<boolean>;
  fetchCategories: () => Promise<void>;
}

export type RecentSongsStore = RecentSongsState & RecentSongsActions;

export const AD_COUNT = BROWSER_SONGS.recentAdCount;
export const PAGE_SIZE = BROWSER_SONGS.recentPageSize;
export const FETCH_COUNT = BROWSER_SONGS.recentFetchCount;

export type FeedItem =
  | { type: 'song'; data: SongPreviewDtoType }
  | { type: 'ad' }
  | { type: 'loading' };

function createLoadingItems(count: number): FeedItem[] {
  return Array.from({ length: count }, () => ({ type: 'loading' as const }));
}

function injectAdSlots(songs: SongPreviewDtoType[], page: number): FeedItem[] {
  const songItems: FeedItem[] = songs.map((song) => ({
    type: 'song',
    data: song,
  }));

  if (AD_COUNT <= 0) {
    return songItems;
  }

  const result: FeedItem[] = [...songItems];

  for (let i = 0; i < AD_COUNT; i++) {
    const insertionIndex = (page * 7 + i * 13) % (result.length + 1);
    result.splice(insertionIndex, 0, { type: 'ad' });
  }

  return result;
}
const createRecentSongsStore = (initialRecentSongs: SongPreviewDtoType[]) => {
  let fetchController: AbortController | null = null;

  return createStore<RecentSongsStore>((set, get) => {
    const fetchRecentSongs = async (targetPage?: number) => {
      if (fetchController) {
        fetchController.abort();
      }

      const controller = new AbortController();
      fetchController = controller;
      const pageToFetch = targetPage ?? get().page;
      const { selectedCategory } = get();
      set({ isLoading: true });

      try {
        const params: Record<string, unknown> = {
          page: pageToFetch,
          limit: FETCH_COUNT,
          sort: 'recent',
          order: 'desc',
        };

        if (selectedCategory) {
          params.category = selectedCategory;
        }

        const response = await axiosInstance.get<PageDto<SongPreviewDtoType>>(
          '/song',
          { params, signal: controller.signal },
        );
        const fetchedSongs = response.data.content;
        const newSongs = injectAdSlots(fetchedSongs, pageToFetch);

        set((state) => ({
          recentItems: [
            ...state.recentItems.filter((item) => item.type !== 'loading'),
            ...newSongs,
          ],
          hasMore: fetchedSongs.length >= FETCH_COUNT,
          recentError: '',
          page: pageToFetch,
        }));

        return true;
      } catch (error) {
        if (controller.signal.aborted) {
          return false;
        }

        set((state) => ({
          recentItems: state.recentItems.filter(
            (item) => item.type !== 'loading',
          ),
          recentError: 'Error loading recent songs',
        }));
        return false;
      } finally {
        if (fetchController === controller) {
          fetchController = null;
          set({ isLoading: false });
        }
      }
    };

    return {
      recentItems: injectAdSlots(initialRecentSongs, 1),
      recentError: '',
      isLoading: false,
      hasMore: initialRecentSongs.length >= FETCH_COUNT,
      selectedCategory: '',
      categories: {},
      page: 1,

      fetchCategories: async () => {
        try {
          const response = await axiosInstance.get<Record<string, number>>(
            '/song/categories',
          );
          set({ categories: response.data });
        } catch (error) {
          set({ categories: {} });
        }
      },

      fetchRecentSongs,

      setSelectedCategory: (category) => {
        set({
          selectedCategory: category,
          page: 1,
          recentItems: createLoadingItems(FETCH_COUNT),
          hasMore: true,
          recentError: '',
        });
        void fetchRecentSongs(1);
      },

      increasePageRecent: async () => {
        const { isLoading, recentError, hasMore, recentItems, page } = get();

        if (isLoading || recentError || !hasMore) {
          return;
        }

        const nextPage = page + 1;
        set({
          recentItems: [...recentItems, ...createLoadingItems(FETCH_COUNT)],
        });

        const didLoad = await fetchRecentSongs(nextPage);
        if (!didLoad) {
          set((state) => ({
            recentItems: state.recentItems.filter(
              (item) => item.type !== 'loading',
            ),
          }));
        }
      },
    };
  });
};

type RecentSongsStoreApi = ReturnType<typeof createRecentSongsStore>;
const RecentSongsStoreContext = createContext<RecentSongsStoreApi | null>(null);

export function useRecentSongsStore<T>(
  selector: (state: RecentSongsStore) => T,
): T {
  const store = useContext(RecentSongsStoreContext);
  if (!store) {
    throw new Error(
      'useRecentSongsStore must be used within RecentSongsProvider',
    );
  }
  return useStore(store, selector);
}

type RecentSongsProviderProps = {
  children: React.ReactNode;
  initialRecentSongs: SongPreviewDtoType[];
};

export function RecentSongsProvider({
  children,
  initialRecentSongs,
}: RecentSongsProviderProps) {
  const storeRef = useRef<RecentSongsStoreApi | null>(null);

  if (!storeRef.current) {
    storeRef.current = createRecentSongsStore(initialRecentSongs);
  }

  return (
    <RecentSongsStoreContext.Provider value={storeRef.current}>
      {children}
    </RecentSongsStoreContext.Provider>
  );
}
