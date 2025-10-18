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
  // Helper function to find the first non-empty timespan or default to 'week'
  const getInitialTimespan = (): TimespanType => {
    // Check if all timespans have songs
    const allHaveSongs = TIMESPANS.every(
      (ts) => initialFeaturedSongs[ts]?.length > 0,
    );

    // If all have songs, default to 'week'
    if (allHaveSongs) {
      return 'week';
    }

    // Otherwise, find the first timespan that has songs
    for (const ts of TIMESPANS) {
      if (initialFeaturedSongs[ts]?.length > 0) {
        return ts;
      }
    }

    // If none have songs, default to 'week'
    return 'week';
  };

  const initialTimespan = getInitialTimespan();

  // Featured songs
  const [featuredSongs] = useState<FeaturedSongsDto>(initialFeaturedSongs);
  const [featuredSongsPage, setFeaturedSongsPage] = useState<SongPreviewDto[]>(
    initialFeaturedSongs[initialTimespan],
  );

  const [timespan, setTimespan] = useState<TimespanType>(initialTimespan);

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
