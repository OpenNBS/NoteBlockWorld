'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import axiosInstance from '@web/src/lib/axios';
import { getTokenLocal } from '@web/src/lib/axios/token.utils';

import { MySongsSongDTO, SongsFolder, SongsPage } from '../../types';

type MySongsContextType = {
  page: SongsPage | null;
  nextpage: () => void;
  prevpage: () => void;
  gotoPage: (page: number) => void;
  totalSongs: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  songToDelete: MySongsSongDTO | null;
  setSongToDelete: (song: MySongsSongDTO) => void;
  deleteSong: () => void;
};

const MySongsContext = createContext<MySongsContextType>(
  {} as MySongsContextType,
);

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
  pageSizeInit = 10,
}: MySongProviderProps) => {
  const [loadedSongs, setLoadedSongs] =
    useState<SongsFolder>(InitialsongsFolder);
  const [totalSongs, setTotalSongs] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(totalPagesInit);
  const [currentPage, setCurrentPage] = useState<number>(currentPageInit);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [pageSize, _setPageSize] = useState<number>(pageSizeInit);
  const [page, setPage] = useState<SongsPage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [songToDelete, setSongToDelete] = useState<MySongsSongDTO | null>(null);

  const putPage = useCallback(
    async ({ key, page }: { key: number; page: SongsPage }) => {
      setLoadedSongs({ ...loadedSongs, [key]: page });
    },
    [loadedSongs],
  );

  const fetchSongsPage = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    const token = getTokenLocal();
    try {
      const response = await axiosInstance.get(
        `/my-songs?page=${currentPage}&limit=${pageSize}&sort=createdAt&order=false`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      const data = response.data as SongsPage;
      // TODO: total, page and pageSize are stored in every page, when it should be stored in the folder (what matters is 'content')
      putPage({
        key: currentPage,
        page: data,
      });
      setTotalSongs(data.total);
      setTotalPages(Math.ceil(data.total / pageSize));
      setPage(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
      if (error instanceof Response) {
        setError(error.statusText);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, putPage]);

  const loadPage = useCallback(async () => {
    if (currentPage in loadedSongs) {
      setPage(loadedSongs[currentPage]);
      setIsLoading(false);
      return;
    }
    await fetchSongsPage();
  }, [currentPage, fetchSongsPage, loadedSongs]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      loadPage();
    })();
  }, [currentPage, loadPage]);

  const gotoPage = useCallback(
    (page: number) => {
      if (page > 0 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  const nextpage = useCallback(() => {
    if (currentPage < totalPages) {
      gotoPage(currentPage + 1);
    }
  }, [currentPage, totalPages, gotoPage]);

  const prevpage = useCallback(() => {
    if (currentPage > 1) {
      gotoPage(currentPage - 1);
    }
  }, [currentPage, gotoPage]);

  const deleteSong = useCallback(async () => {
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
      setIsDeleteDialogOpen(false);
      setSongToDelete(null);
      await fetchSongsPage();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
      if (error instanceof Response) {
        setError(error.statusText);
      }
    }
  }, [songToDelete, fetchSongsPage]);

  return (
    <MySongsContext.Provider
      value={{
        page,
        nextpage,
        prevpage,
        gotoPage,
        totalSongs,
        totalPages,
        currentPage,
        pageSize,
        isLoading,
        error,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        songToDelete,
        setSongToDelete,
        deleteSong,
      }}
    >
      {children}
    </MySongsContext.Provider>
  );
};

export const useMySongsProvider = () => {
  const context = useContext(MySongsContext);
  if (context === undefined || context === null) {
    throw new Error('useMySongsProvider must be used within a MySongsProvider');
  }
  return context;
};
