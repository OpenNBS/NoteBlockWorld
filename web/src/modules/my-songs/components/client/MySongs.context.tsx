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

import { SongsFolder, SongsPage } from '../../types';

type MySongsContextType = {
  page: SongsPage | null;
  nextpage: () => void;
  prevpage: () => void;
  gotoPage: (page: number) => void;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
};

const MySongsContext = createContext<MySongsContextType>(
  {} as MySongsContextType
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
  pageSizeInit = 20,
}: MySongProviderProps) => {
  const [loadedSongs, setLoadedSongs] =
    useState<SongsFolder>(InitialsongsFolder);
  const [totalPages, setTotalPages] = useState<number>(totalPagesInit);
  const [currentPage, setCurrentPage] = useState<number>(currentPageInit);
  // eslint-disable-next-line no-unused-vars
  const [pageSize, _] = useState<number>(pageSizeInit);
  const [page, setPage] = useState<SongsPage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const putPage = async ({ key, page }: { key: number; page: SongsPage }) => {
    setLoadedSongs({ ...loadedSongs, [key]: page });
  };
  const fetchSongsPage = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    const token = getTokenLocal();
    try {
      const response = await axiosInstance.get(
        `/song/my?page=${currentPage}&limit=${pageSize}&sort=createdAt&order=false`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data as SongsPage;
      putPage({
        key: currentPage,
        page: data,
      });
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
  }, [currentPage, pageSize]);
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
  }, [currentPage]);

  const gotoPage = useCallback(
    (page: number) => {
      if (page > 0 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
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

  return (
    <MySongsContext.Provider
      value={{
        page,
        nextpage,
        prevpage,
        gotoPage,
        totalPages,
        currentPage,
        isLoading,
        error,
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
