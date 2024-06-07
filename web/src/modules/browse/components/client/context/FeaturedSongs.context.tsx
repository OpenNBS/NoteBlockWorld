'use client';

import { PageQueryDTOType } from '@shared/validation/common/dto/types';
import {
  SongPreviewDtoType,
  TimespanType,
} from '@shared/validation/song/dto/types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import axiosInstance from '@web/src/lib/axios';

type FeaturedSongsContextType = {
  featuredSongs: SongPreviewDtoType[];
  featuredLoading: boolean;
  featuredError: string;
  timespan: TimespanType;
  setTimespan: (timespan: TimespanType) => void;
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
  const [timespan, setTimespan] = useState<TimespanType>('week');

  const fetchFeaturedSongs = useCallback(
    async function () {
      //setFeaturedLoading(true);
      setFeaturedSongs(Array(5).fill(null));
      const params: PageQueryDTOType = {
        sort: 'featured',
        timespan: timespan,
        limit: 3, // unused
      };
      try {
        const response = await axiosInstance.get<SongPreviewDtoType[]>(
          '/song',
          {
            params,
          },
        );
        setFeaturedSongs(response.data);
      } catch (error) {
        setFeaturedError('Error loading featured songs');
      } finally {
        setFeaturedLoading(false);
      }
    },
    [timespan],
  );

  useEffect(() => {
    fetchFeaturedSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timespan]);
  return (
    <FeaturedSongsContext.Provider
      value={{
        featuredSongs,
        featuredLoading,
        featuredError,
        timespan,
        setTimespan,
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
