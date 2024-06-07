'use client';

import { PageQueryDTOType } from '@shared/validation/common/dto/types';
import { BROWSER_SONGS } from '@shared/validation/song/constants';
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
  isLoading: boolean;
  hasMore: boolean;
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
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchRecentSongs = useCallback(
    async function () {
      setLoading(true);
      //setRecentSongs([...recentSongs, ...Array(8).fill(null)]);
      const params: PageQueryDTOType = {
        page: page,
        limit: 8 * 2, // TODO: fiz constants
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
        setLoading(false);
      } catch (error) {
        setRecentSongs(recentSongs.filter((song) => song !== null));
        setRecentError('Error loading recent songs');
      } finally {
        setLoading(false);
        setHasMore(recentSongs.length < BROWSER_SONGS.max_recent_songs);
      }
    },
    [page, recentSongs],
  );
  useEffect(() => {
    fetchRecentSongs();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  function increasePageRecent() {
    if (
      BROWSER_SONGS.max_recent_songs <= recentSongs.length ||
      loading ||
      recentError ||
      !hasMore
    ) {
      return;
    }
    setPage((prev) => prev + 1);
  }
  return (
    <RecentSongsContext.Provider
      value={{
        recentSongs,
        recentError,
        isLoading: loading,
        hasMore,
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
