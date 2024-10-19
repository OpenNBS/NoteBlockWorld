'use client';

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
  increasePageRecent: () => Promise<void>;
  isLoading: boolean;
  hasMore: boolean;
  selectedCategory: string;
  categories: Record<string, number>;
  setSelectedCategory: (category: string) => void;
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
  const [page, setPage] = useState<number>(3);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [endpoint, setEndpoint] = useState<string>('/song-browser/recent');

  const fetchRecentSongs = useCallback(
    async function () {
      setLoading(true);

      try {
        const response = await axiosInstance.get<SongPreviewDtoType[]>(
          endpoint,
          {
            params: {
              page,
              limit: 8, // TODO: fix constants
              order: false,
            },
          },
        );

        setRecentSongs((prevSongs) => [
          ...prevSongs.filter((song) => song !== null),
          ...response.data,
        ]);

        if (response.data.length < 8) {
          setHasMore(false);
        }
      } catch (error) {
        setRecentSongs((prevSongs) =>
          prevSongs.filter((song) => song !== null),
        );

        setRecentError('Error loading recent songs');
      } finally {
        setLoading(false);
      }
    },
    [page, endpoint],
  );

  const fetchCategories = useCallback(async function () {
    try {
      const response = await axiosInstance.get<Record<string, number>>(
        '/song-browser/categories',
      );

      return response.data;
    } catch (error) {
      return {};
    }
  }, []);

  // Fetch categories on initial render
  useEffect(() => {
    fetchCategories().then((data) => setCategories(data));
  }, [fetchCategories]);

  // Reset recent songs and set the endpoint when category changes
  useEffect(() => {
    setPage(1);
    setRecentSongs(Array(12).fill(null));
    setHasMore(true);

    const newEndpoint =
      selectedCategory === ''
        ? '/song-browser/recent'
        : `/song-browser/categories/${selectedCategory}`;

    setEndpoint(newEndpoint);
  }, [selectedCategory]);

  // Fetch recent songs when the page or endpoint changes
  useEffect(() => {
    fetchRecentSongs();
  }, [page, endpoint]);

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
  }

  return (
    <RecentSongsContext.Provider
      value={{
        recentSongs,
        recentError,
        isLoading: loading,
        hasMore,
        categories,
        selectedCategory,
        setSelectedCategory,
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
