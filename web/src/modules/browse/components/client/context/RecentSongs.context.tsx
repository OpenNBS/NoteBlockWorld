'use client';

import { BROWSER_SONGS } from '@shared/validation/song/constants';
import { SongPreviewDtoType } from '@shared/validation/song/dto/types';
import { createContext, useCallback, useContext, useState } from 'react';

import axiosInstance from '@web/src/lib/axios';

type RecentSongsContextType = {
  recentSongs: (SongPreviewDtoType | null)[];
  recentError: string;
  increasePageRecent: () => Promise<void>;
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
  const [page, setPage] = useState<number>(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchRecentSongs = useCallback(
    async function () {
      setLoading(true);

      try {
        const response = await axiosInstance.get<SongPreviewDtoType[]>(
          '/song-browser/recent',
          {
            params: {
              page: page,
              limit: 12, // TODO: fiz constants
              order: false,
            },
          },
        );

        setRecentSongs([
          ...recentSongs.filter((song) => song !== null),
          ...response.data,
        ]);

        setLoading(false);

        if (response.data.length === 0) {
          setHasMore(false);

          return;
        }
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

  async function increasePageRecent() {
    if (
      BROWSER_SONGS.max_recent_songs <= recentSongs.length ||
      loading ||
      recentError ||
      !hasMore
    ) {
      return;
    }

    setPage((prev) => prev + 1);
    await fetchRecentSongs();
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
