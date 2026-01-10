'use client';

import type { FeaturedSongsDtoType, SongPreviewDtoType } from '@nbw/database';

import {
  FeaturedSongsProvider,
  useFeaturedSongsStore,
} from './FeaturedSongs.context';
import {
  RecentSongsProvider,
  useRecentSongsStore,
} from './RecentSongs.context';

/**
 * Composed hook that provides access to both FeaturedSongs and RecentSongs stores
 */
export function useHomePageStore() {
  const featuredSongs = useFeaturedSongsStore();
  const recentSongs = useRecentSongsStore();

  return {
    featuredSongs,
    recentSongs,
  };
}

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
    <RecentSongsProvider initialRecentSongs={initialRecentSongs}>
      <FeaturedSongsProvider initialFeaturedSongs={initialFeaturedSongs}>
        {children}
      </FeaturedSongsProvider>
    </RecentSongsProvider>
  );
}

// Legacy hook name for backward compatibility
export function useHomePageProvider() {
  return useHomePageStore();
}
