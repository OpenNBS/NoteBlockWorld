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
  recentSongs: (SongPreviewDtoType | null)[];
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

  const [recentError, setRecentError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchRecentSongs = useCallback(
    async function () {
      setRecentSongs([...recentSongs, ...Array(8).fill(null)]);

      const params: PageQueryDTOType = {
        page: currentPage,
        limit: 10, // TODO: fiz constants
        sort: 'recent',
        order: false,
      };

      try {
        const response = await axiosInstance.get<SongPreviewDtoType[]>(
          '/song',
          { params },
        );

        setRecentSongs([
          ...recentSongs.filter((song) => song !== null),
          ...response.data,
        ]);
      } catch (error) {
        setRecentSongs(recentSongs.filter((song) => song !== null));
        setRecentError('Error loading recent songs');
      }
    },
    [currentPage, recentSongs],
  );

  useEffect(() => {
    fetchRecentSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  function increasePageRecent() {
    setCurrentPage((prev) => prev + 1);
  }

  return (
    <RecentSongsContext.Provider
      value={{
        recentSongs,
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
