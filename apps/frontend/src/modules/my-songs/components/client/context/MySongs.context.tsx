'use client';

import { MY_SONGS } from '@nbw/config';
import type {
  SongPageDtoType,
  SongPreviewDtoType,
  SongsFolder
} from '@nbw/database';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { toast } from 'react-hot-toast';

import axiosInstance from '@web/lib/axios';
import { getTokenLocal } from '@web/lib/axios/token.utils';

type MySongsContextType = {
  page: SongPageDtoType | null;
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
  songToDelete: SongPreviewDtoType | null;
  setSongToDelete: (song: SongPreviewDtoType) => void;
  deleteSong: () => void;
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
  pageSizeInit = MY_SONGS.PAGE_SIZE
}: MySongProviderProps) => {
  const [loadedSongs, setLoadedSongs] =
    useState<SongsFolder>(InitialsongsFolder);

  const [totalSongs, setTotalSongs] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(totalPagesInit);
  const [currentPage, setCurrentPage] = useState<number>(currentPageInit);

  const [pageSize, _setPageSize] = useState<number>(pageSizeInit);
  const [page, setPage] = useState<SongPageDtoType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const [songToDelete, setSongToDelete] = useState<SongPreviewDtoType | null>(
    null
  );

  const putPage = useCallback(
    async ({ key, page }: { key: number; page: SongPageDtoType }) => {
      setLoadedSongs({ ...loadedSongs, [key]: page });
    },
    [loadedSongs]
  );

  const fetchSongsPage = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    const token = getTokenLocal();

    try {
      const response = await axiosInstance.get('/my-songs', {
        params: {
          page : currentPage,
          limit: pageSize,
          sort : 'createdAt',
          order: 'false'
        },
        headers: {
          authorization: `Bearer ${token}`
        }
      });

      const data = response.data as SongPageDtoType;

      // TODO: total, page and pageSize are stored in every page, when it should be stored in the folder (what matters is 'content')
      putPage({
        key : currentPage,
        page: data
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

  const deleteSong = useCallback(async () => {
    if (!songToDelete) {
      return;
    }

    const token = getTokenLocal();

    try {
      await axiosInstance.delete(`/song/${songToDelete.publicId}`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      });

      setIsDeleteDialogOpen(false);
      setSongToDelete(null);
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
        deleteSong
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
