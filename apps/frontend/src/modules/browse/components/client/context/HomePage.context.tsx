'use client';

import type { FeaturedSongsDtoType, SongPreviewDtoType } from '@nbw/database';

import { FeaturedSongsProvider } from './FeaturedSongs.context';
import { RecentSongsProvider } from './RecentSongs.context';

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
