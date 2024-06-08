'use client';

import {
  FeaturedSongsDtoType,
  SongPreviewDtoType,
  TimespanType,
} from '@shared/validation/song/dto/types';
import { createContext, useContext, useEffect, useState } from 'react';

type FeaturedSongsContextType = {
  featuredSongsPage: SongPreviewDtoType[];
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
  initialFeaturedSongs: FeaturedSongsDtoType;
}) {
  // Featured songs
  const [featuredSongs] = useState<FeaturedSongsDtoType>(initialFeaturedSongs);

  const [featuredSongsPage, setFeaturedSongsPage] = useState<
    SongPreviewDtoType[]
  >(initialFeaturedSongs.week);

  const [timespan, setTimespan] = useState<TimespanType>('week');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setFeaturedSongsPage(featuredSongs[timespan]);
  }, [featuredSongs, timespan]);

  return (
    <FeaturedSongsContext.Provider
      value={{
        featuredSongsPage,
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
