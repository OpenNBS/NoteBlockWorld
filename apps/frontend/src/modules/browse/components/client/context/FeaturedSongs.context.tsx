'use client';

import { useEffect } from 'react';
import { create } from 'zustand';

import { TIMESPANS } from '@nbw/config';
import { type FeaturedSongsDto, type SongPreviewDto } from '@nbw/database';

type TimespanType = (typeof TIMESPANS)[number];

interface FeaturedSongsState {
  featuredSongs: FeaturedSongsDto;
  featuredSongsPage: SongPreviewDto[];
  timespan: TimespanType;
  timespanEmpty: Record<string, boolean>;
}

interface FeaturedSongsActions {
  initialize: (initialFeaturedSongs: FeaturedSongsDto) => void;
  setTimespan: (timespan: TimespanType) => void;
}

type FeaturedSongsStore = FeaturedSongsState & FeaturedSongsActions;

// Helper function to find the first non-empty timespan or default to 'week'
const getInitialTimespan = (featuredSongs: FeaturedSongsDto): TimespanType => {
  // Check if all timespans have songs
  const allHaveSongs = TIMESPANS.every((ts) => featuredSongs[ts]?.length > 0);

  // If all have songs, default to 'week'
  if (allHaveSongs) {
    return 'week';
  }

  // Otherwise, find the first timespan that has songs
  for (const ts of TIMESPANS) {
    if (featuredSongs[ts]?.length > 0) {
      return ts;
    }
  }

  // If none have songs, default to 'week'
  return 'week';
};

export const useFeaturedSongsStore = create<FeaturedSongsStore>((set, get) => ({
  // Initial state
  featuredSongs: {
    hour: [],
    day: [],
    week: [],
    month: [],
    year: [],
    all: [],
  },
  featuredSongsPage: [],
  timespan: 'week',
  timespanEmpty: {},

  // Actions
  initialize: (initialFeaturedSongs) => {
    const initialTimespan = getInitialTimespan(initialFeaturedSongs);
    const timespanEmpty = Object.keys(initialFeaturedSongs).reduce(
      (result, timespan) => {
        result[timespan] =
          initialFeaturedSongs[timespan as TimespanType].length === 0;
        return result;
      },
      {} as Record<string, boolean>,
    );

    set({
      featuredSongs: initialFeaturedSongs,
      featuredSongsPage: initialFeaturedSongs[initialTimespan],
      timespan: initialTimespan,
      timespanEmpty,
    });
  },

  setTimespan: (timespan) => {
    const { featuredSongs } = get();
    set({
      timespan,
      featuredSongsPage: featuredSongs[timespan],
    });
  },
}));

// Legacy hook name for backward compatibility
export const useFeaturedSongsProvider = () => {
  return useFeaturedSongsStore();
};

// Provider component for initialization (now just a wrapper)
type FeaturedSongsProviderProps = {
  children: React.ReactNode;
  initialFeaturedSongs: FeaturedSongsDto;
};

export function FeaturedSongsProvider({
  children,
  initialFeaturedSongs,
}: FeaturedSongsProviderProps) {
  const initialize = useFeaturedSongsStore((state) => state.initialize);

  useEffect(() => {
    initialize(initialFeaturedSongs);
  }, [initialFeaturedSongs, initialize]);

  return <>{children}</>;
}
