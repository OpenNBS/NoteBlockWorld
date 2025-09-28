'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { TIMESPANS } from '@nbw/config';
import { type FeaturedSongsDto, type SongPreviewDto } from '@nbw/database';

type TimespanType = (typeof TIMESPANS)[number];

type FeaturedSongsContextType = {
  featuredSongsPage: SongPreviewDto[];
  timespan: TimespanType;
  setTimespan: (timespan: TimespanType) => void;
  timespanEmpty: Record<string, boolean>;
};

const FeaturedSongsContext = createContext<FeaturedSongsContextType>(
  {} as FeaturedSongsContextType,
);

export function FeaturedSongsProvider({
  children,
  initialFeaturedSongs,
}: {
  children: React.ReactNode;
  initialFeaturedSongs: FeaturedSongsDto;
}) {
  // Featured songs
  const [featuredSongs] = useState<FeaturedSongsDto>(initialFeaturedSongs);

  const [featuredSongsPage, setFeaturedSongsPage] = useState<SongPreviewDto[]>(
    initialFeaturedSongs.week,
  );

  const [timespan, setTimespan] = useState<TimespanType>('week');

  const timespanEmpty = Object.keys(featuredSongs).reduce(
    (result, timespan) => {
      result[timespan] = featuredSongs[timespan as TimespanType].length === 0;
      return result;
    },
    {} as Record<string, boolean>,
  );

  useEffect(() => {
    setFeaturedSongsPage(featuredSongs[timespan]);
  }, [featuredSongs, timespan]);

  return (
    <FeaturedSongsContext.Provider
      value={{
        featuredSongsPage,
        timespan,
        setTimespan,
        timespanEmpty,
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
