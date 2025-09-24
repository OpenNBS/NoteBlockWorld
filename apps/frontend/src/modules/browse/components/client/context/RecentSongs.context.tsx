'use client';

import { SongPreviewDtoType } from '@nbw/database';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

import axiosInstance from '@web/lib/axios';

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
  {} as RecentSongsContextType
);

export function RecentSongsProvider({
  children,
  initialRecentSongs
}: {
  children: React.ReactNode;
  initialRecentSongs: SongPreviewDtoType[];
}) {
  // Recent songs
  const [recentSongs, setRecentSongs] =
    useState<SongPreviewDtoType[]>(initialRecentSongs);

  const [recentError, setRecentError] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [endpoint, setEndpoint] = useState<string>('/song-browser/recent');

  const adCount = 1;
  const pageSize = 12;

  const fetchRecentSongs = useCallback(
    async function () {
      setLoading(true);

      try {
        const fetchCount = pageSize - adCount;

        const response = await axiosInstance.get<SongPreviewDtoType[]>(
          endpoint,
          {
            params: {
              page,
              limit: fetchCount, // TODO: fix constants
              order: false
            }
          }
        );

        const newSongs: Array<SongPreviewDtoType | undefined> = response.data;

        for (let i = 0; i < adCount; i++) {
          const adPosition = Math.floor(Math.random() * newSongs.length) + 1;
          newSongs.splice(adPosition, 0, undefined);
        }

        setRecentSongs((prevSongs) => [
          ...prevSongs.filter((song) => song !== null),
          ...response.data
        ]);

        if (response.data.length < fetchCount) {
          setHasMore(false);
        }
      } catch (error) {
        setRecentSongs((prevSongs) =>
          prevSongs.filter((song) => song !== null)
        );

        setRecentError('Error loading recent songs');
      } finally {
        setLoading(false);
      }
    },
    [page, endpoint]
  );

  const fetchCategories = useCallback(async function () {
    try {
      const response = await axiosInstance.get<Record<string, number>>(
        '/song-browser/categories'
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

  useEffect(() => {
    if (page === 0) return;
    fetchRecentSongs();
  }, [page, endpoint, fetchRecentSongs]);

  async function increasePageRecent() {
    if (loading || recentError || !hasMore) {
      return;
    }

    setRecentSongs([...recentSongs, ...Array(12).fill(null)]);
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
        increasePageRecent
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
      'useRecentSongsProvider must be used within a RecentSongsProvider'
    );
  }

  return context;
}
