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

import { useHomePageProvider } from './HomePage.context';

type FeaturedSongsContextType = {
  featuredSongs: SongPreviewDtoType[];
  featuredLoading: boolean;
  featuredError: string;
  increasePageFeatured: () => void;
};
const FeaturedSongsContext = createContext<FeaturedSongsContextType>(
  {} as FeaturedSongsContextType,
);
export function FeaturedSongsProvider({
  children,
  initialFeaturedSongs,
}: {
  children: React.ReactNode;
  initialFeaturedSongs: SongPreviewDtoType[];
}) {
  // Featured songs
  const [featuredSongs, setFeaturedSongs] =
    useState<SongPreviewDtoType[]>(initialFeaturedSongs);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredError, setFeaturedError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { timespan } = useHomePageProvider();
  const fetchFeaturedSongs = useCallback(
    async function () {
      //setFeaturedLoading(true);
      const params: PageQueryDTOType = {
        page: currentPage,
        limit: 10, // TODO: fiz constants
        sort: 'playCount',
        order: false,
        timespan: timespan,
      };
      try {
        const response = await axiosInstance.get('/song', {
          params,
        });
        setFeaturedSongs([...featuredSongs, ...response.data]);
      } catch (error) {
        setFeaturedError('Error loading featured songs');
      } finally {
        setFeaturedLoading(false);
      }
    },
    [currentPage, featuredSongs, timespan],
  );
  useEffect(() => {
    fetchFeaturedSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);
  function increasePageFeatured() {
    setCurrentPage((prev) => prev + 1);
  }
  return (
    <FeaturedSongsContext.Provider
      value={{
        featuredSongs,
        featuredLoading,
        featuredError,
        increasePageFeatured,
      }}
    >
      {children}
    </FeaturedSongsContext.Provider>
  );
}

export function useFeaturedSongsProvider() {
  const context = useContext(FeaturedSongsContext);
  if (context === undefined || context === null) {
    throw new Error(
      'useFeaturedSongsProvider must be used within a FeaturedSongsProvider',
    );
  }
  return context;
}
