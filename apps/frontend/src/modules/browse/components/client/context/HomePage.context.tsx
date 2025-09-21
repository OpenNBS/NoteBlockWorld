'use client';

import { FeaturedSongsDtoType, SongPreviewDtoType } from '@nbw/database';
import { createContext, useContext } from 'react';

import { FeaturedSongsProvider } from './FeaturedSongs.context';
import { RecentSongsProvider } from './RecentSongs.context';

type HomePageContextType = null;

const HomePageContext = createContext<HomePageContextType>(
  null as HomePageContextType,
);

export function HomePageProvider({
  children,
  initialRecentSongs,
  initialFeaturedSongs,
}: {
  children: React.ReactNode;
  initialRecentSongs: SongPreviewDtoType[];
  initialFeaturedSongs: FeaturedSongsDtoType;
}) {
  return (
    <HomePageContext.Provider value={null}>
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
