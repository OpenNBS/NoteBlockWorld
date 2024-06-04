'use client';

import {
  SongPreviewDtoType,
  TimespanType,
} from '@shared/validation/song/dto/types';
import { createContext, useContext, useState } from 'react';

import { FeaturedSongsProvider } from './FeaturedSongs.context';
import { RecentSongsProvider } from './RecentSongs.context';

type HomePageContextType = {
  timespan: TimespanType;
  setTimespan: (timespan: TimespanType) => void;
};

const HomePageContext = createContext<HomePageContextType>(
  {} as HomePageContextType,
);

export function HomePageProvider({
  children,
  initialRecentSongs,
  initialFeaturedSongs,
}: {
  children: React.ReactNode;
  initialRecentSongs: SongPreviewDtoType[];
  initialFeaturedSongs: SongPreviewDtoType[];
}) {
  const [timespan, setTimespan] = useState<TimespanType>('week');

  return (
    <HomePageContext.Provider
      value={{
        timespan,
        setTimespan,
      }}
    >
      <RecentSongsProvider initialRecentSongs={initialRecentSongs}>
        <FeaturedSongsProvider initialFeaturedSongs={initialFeaturedSongs}>
          {children}
        </FeaturedSongsProvider>
      </RecentSongsProvider>
    </HomePageContext.Provider>
  );
}

export function useHomePageProvider() {
  const context = useContext(HomePageContext);
  if (context === undefined || context === null) {
    throw new Error(
      'useHomePageProvider must be used within a HomepageProvider',
    );
  }
  return context;
}
