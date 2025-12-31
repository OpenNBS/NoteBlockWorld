'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { create } from 'zustand';

import { MY_SONGS } from '@nbw/config';
import type {
  SongPageDtoType,
  SongPreviewDtoType,
  SongsFolder,
} from '@nbw/database';
import axiosInstance from '@web/lib/axios';
import { getTokenLocal } from '@web/lib/axios/token.utils';

interface MySongsState {
  loadedSongs: SongsFolder;
  page: SongPageDtoType | null;
  totalSongs: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
  isDeleteDialogOpen: boolean;
  songToDelete: SongPreviewDtoType | null;
}

interface MySongsActions {
  initialize: (
    initialSongsFolder: SongsFolder,
    totalPagesInit: number,
    currentPageInit: number,
    pageSizeInit: number,
  ) => void;
  fetchSongsPage: () => Promise<void>;
  loadPage: () => Promise<void>;
  gotoPage: (page: number) => void;
  nextpage: () => void;
  prevpage: () => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setSongToDelete: (song: SongPreviewDtoType) => void;
  deleteSong: () => Promise<void>;
}

type MySongsStore = MySongsState & MySongsActions;

export const useMySongsStore = create<MySongsStore>((set, get) => ({
  // Initial state
  loadedSongs: {},
  page: null,
  totalSongs: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: MY_SONGS.PAGE_SIZE,
  isLoading: true,
  error: null,
  isDeleteDialogOpen: false,
  songToDelete: null,

  // Actions
  initialize: (
    initialSongsFolder,
    totalPagesInit,
    currentPageInit,
    pageSizeInit,
  ) => {
    const initialPage = initialSongsFolder[currentPageInit] || null;
    set({
      loadedSongs: initialSongsFolder,
      totalPages: totalPagesInit,
      currentPage: currentPageInit,
      pageSize: pageSizeInit,
      page: initialPage,
      totalSongs: initialPage?.total || 0,
      isLoading: false,
    });
  },

  fetchSongsPage: async () => {
    const { currentPage, pageSize } = get();
    set({ isLoading: true });
    const token = getTokenLocal();

    try {
      const response = await axiosInstance.get('/my-songs', {
        params: {
          page: currentPage,
          limit: pageSize,
          sort: 'createdAt',
          order: 'false',
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const data = response.data as SongPageDtoType;

      // TODO: total, page and pageSize are stored in every page, when it should be stored in the folder (what matters is 'content')
      set((state) => ({
        loadedSongs: { ...state.loadedSongs, [currentPage]: data },
        totalSongs: data.total,
        totalPages: Math.ceil(data.total / pageSize),
        page: data,
        error: null,
      }));
    } catch (error: unknown) {
      let errorMessage: string | null = null;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error instanceof Response) {
        errorMessage = error.statusText;
      }
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  loadPage: async () => {
    const { currentPage, loadedSongs, fetchSongsPage } = get();

    set({ isLoading: true });

    if (currentPage in loadedSongs) {
      set({
        page: loadedSongs[currentPage],
        isLoading: false,
      });
      return;
    }

    await fetchSongsPage();
  },

  gotoPage: (page) => {
    const { totalPages } = get();
    if (page > 0 && page <= totalPages) {
      set({ currentPage: page });
    }
  },

  nextpage: () => {
    const { currentPage, totalPages, gotoPage } = get();
    if (currentPage < totalPages) {
      gotoPage(currentPage + 1);
    }
  },

  prevpage: () => {
    const { currentPage, gotoPage } = get();
    if (currentPage > 1) {
      gotoPage(currentPage - 1);
    }
  },

  setIsDeleteDialogOpen: (isOpen) => {
    set({ isDeleteDialogOpen: isOpen });
  },

  setSongToDelete: (song) => {
    set({ songToDelete: song });
  },

  deleteSong: async () => {
    const { songToDelete, fetchSongsPage } = get();
    if (!songToDelete) {
      return;
    }

    const token = getTokenLocal();

    try {
      await axiosInstance.delete(`/song/${songToDelete.publicId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      set({
        isDeleteDialogOpen: false,
        songToDelete: null,
      });
    } catch (error: unknown) {
      toast.error('An error occurred while deleting the song!');

      if (error instanceof Error) {
        console.log('Error deleting song: ', error.message);
      } else if (error instanceof Response) {
        console.log('Error deleting song: ', error.statusText);
      }

      return;
    }

    await fetchSongsPage();
    toast.success('Song deleted successfully!');
  },
}));

// Hook to sync currentPage changes with loadPage
export const useMySongsPageLoader = () => {
  const currentPage = useMySongsStore((state) => state.currentPage);
  const loadPage = useMySongsStore((state) => state.loadPage);

  useEffect(() => {
    loadPage();
  }, [currentPage, loadPage]);
};

// Legacy hook name for backward compatibility
export const useMySongsProvider = () => {
  return useMySongsStore();
};

// Provider component for initialization (now just a wrapper)
type MySongProviderProps = {
  InitialsongsFolder?: SongsFolder;
  children?: React.ReactNode;
  totalPagesInit?: number;
  currentPageInit?: number;
  pageSizeInit?: number;
};

export const MySongProvider = ({
  InitialsongsFolder = {},
  children,
  totalPagesInit = 0,
  currentPageInit = 0,
  pageSizeInit = MY_SONGS.PAGE_SIZE,
}: MySongProviderProps) => {
  const initialize = useMySongsStore((state) => state.initialize);

  useEffect(() => {
    initialize(
      InitialsongsFolder,
      totalPagesInit,
      currentPageInit,
      pageSizeInit,
    );
  }, [
    InitialsongsFolder,
    totalPagesInit,
    currentPageInit,
    pageSizeInit,
    initialize,
  ]);

  return <>{children}</>;
};
