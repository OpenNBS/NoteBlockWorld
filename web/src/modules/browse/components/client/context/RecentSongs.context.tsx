'use client';
import { PageQueryDTOType } from '@shared/validation/common/dto/types';
import { SongPreviewDtoType } from '@shared/validation/song/dto/types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import axiosInstance from '@web/src/lib/axios';

type RecentSongsContextType = {
  recentSongs: SongPreviewDtoType[];
  recentLoading: boolean;
  recentError: string;
  increasePageRecent: () => void;
};
const RecentSongsContext = createContext<RecentSongsContextType>(
  {} as RecentSongsContextType,
);
export function RecentSongsProvider({
  children,
  initialRecentSongs,
}: {
  children: React.ReactNode;
  initialRecentSongs: SongPreviewDtoType[];
}) {
  // Recent songs
  const [recentSongs, setRecentSongs] =
    useState<SongPreviewDtoType[]>(initialRecentSongs);
  const [recentLoading, setRecentLoading] = useState(false);
  const [recentError, setRecentError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const fetchRecentSongs = useCallback(
    async function () {
      // setRecentLoading(true);
      const params: PageQueryDTOType = {
        page: currentPage,
        limit: 10, // TODO: fiz constants
        sort: 'createdAt',
        order: false,
      };
      try {
        const response = await axiosInstance.get('/song', {
          params,
        });
        setRecentSongs([...recentSongs, ...response.data]);
      } catch (error) {
        setRecentError('Error loading recent songs');
      } finally {
        setRecentLoading(false);
      }
    },
    [currentPage, recentSongs],
  );
  useEffect(() => {
    fetchRecentSongs();
  }, [fetchRecentSongs, currentPage]);
  const increasePageRecent = useCallback(function () {
    //setCurrentPage((prev) => prev + 1);
  }, []);
  return (
    <RecentSongsContext.Provider
      value={{
        recentSongs,
        recentLoading,
        recentError,
        increasePageRecent,
      }}
    >
      {children}
    </RecentSongsContext.Provider>
  );
}

export function useRecentSongsProvider() {
  const context = useContext(RecentSongsContext);
  if (context === undefined || context === null) {
    throw new Error(
      'useRecentSongsProvider must be used within a RecentSongsProvider',
    );
  }
  return context;
}
