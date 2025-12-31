'use client';

import { useEffect } from 'react';
import { create } from 'zustand';

import { PageDto, SongPreviewDtoType } from '@nbw/database';
import axiosInstance from '@web/lib/axios';

interface RecentSongsState {
  recentSongs: (SongPreviewDtoType | null)[];
  recentError: string;
  isLoading: boolean;
  hasMore: boolean;
  selectedCategory: string;
  categories: Record<string, number>;
  page: number;
}

interface RecentSongsActions {
  initialize: (initialRecentSongs: SongPreviewDtoType[]) => void;
  setSelectedCategory: (category: string) => void;
  increasePageRecent: () => Promise<void>;
  fetchRecentSongs: () => Promise<void>;
  fetchCategories: () => Promise<void>;
}

type RecentSongsStore = RecentSongsState & RecentSongsActions;

const adCount = 1;
const pageSize = 12;

export const useRecentSongsStore = create<RecentSongsStore>((set, get) => ({
  // Initial state
  recentSongs: [],
  recentError: '',
  isLoading: false,
  hasMore: true,
  selectedCategory: '',
  categories: {},
  page: 0,

  // Actions
  initialize: (initialRecentSongs) => {
    // If no initial songs, set page to 1 to trigger fetch
    // Otherwise, keep page at 0 since we already have the first page of data
    const initialPage = initialRecentSongs.length === 0 ? 1 : 0;
    set({
      recentSongs: initialRecentSongs,
      page: initialPage,
      hasMore: true,
      recentError: '',
    });
  },

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

  fetchRecentSongs: async () => {
    const { page, selectedCategory } = get();
    set({ isLoading: true });

    try {
      const fetchCount = pageSize - adCount;

      const params: Record<string, any> = {
        page,
        limit: fetchCount, // TODO: fix constants
        sort: 'recent',
        order: 'desc',
      };

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const response = await axiosInstance.get<PageDto<SongPreviewDtoType>>(
        '/song',
        { params },
      );

      const newSongs: Array<SongPreviewDtoType | undefined> =
        response.data.content;

      for (let i = 0; i < adCount; i++) {
        const adPosition = Math.floor(Math.random() * newSongs.length) + 1;
        newSongs.splice(adPosition, 0, undefined);
      }

      set((state) => ({
        recentSongs: [
          ...state.recentSongs.filter((song) => song !== null),
          ...response.data.content,
        ],
        hasMore: response.data.content.length >= fetchCount,
        recentError: '',
      }));
    } catch (error) {
      set((state) => ({
        recentSongs: state.recentSongs.filter((song) => song !== null),
        recentError: 'Error loading recent songs',
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedCategory: (category) => {
    set({
      selectedCategory: category,
      page: 1,
      recentSongs: Array(12).fill(null),
      hasMore: true,
    });
  },

  increasePageRecent: async () => {
    const { isLoading, recentError, hasMore, recentSongs } = get();

    if (isLoading || recentError || !hasMore) {
      return;
    }

    set({
      recentSongs: [...recentSongs, ...Array(12).fill(null)],
      page: get().page + 1,
    });
  },
}));

// Hook to sync page changes with fetchRecentSongs
export const useRecentSongsPageLoader = () => {
  const page = useRecentSongsStore((state) => state.page);
  const fetchRecentSongs = useRecentSongsStore(
    (state) => state.fetchRecentSongs,
  );

  useEffect(() => {
    if (page === 0) return;
    fetchRecentSongs();
  }, [page, fetchRecentSongs]);
};

// Hook to fetch categories on mount
export const useRecentSongsCategoriesLoader = () => {
  const fetchCategories = useRecentSongsStore((state) => state.fetchCategories);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
};

// Legacy hook name for backward compatibility
export const useRecentSongsProvider = () => {
  const store = useRecentSongsStore();
  // Ensure recentSongs is always an array
  return {
    ...store,
    recentSongs: store.recentSongs || [],
  };
};

// Provider component for initialization (now just a wrapper)
type RecentSongsProviderProps = {
  children: React.ReactNode;
  initialRecentSongs: SongPreviewDtoType[];
};

export function RecentSongsProvider({
  children,
  initialRecentSongs,
}: RecentSongsProviderProps) {
  const initialize = useRecentSongsStore((state) => state.initialize);

  useEffect(() => {
    initialize(initialRecentSongs);
  }, [initialRecentSongs, initialize]);

  return <>{children}</>;
}
