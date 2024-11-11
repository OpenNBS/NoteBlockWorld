import {
  FeaturedSongsDtoType,
  SongPreviewDtoType,
} from '@shared/validation/song/dto/types';
import { Metadata } from 'next';

import axiosInstance from '@web/src/lib/axios';
import { HomePageProvider } from '@web/src/modules/browse/components/client/context/HomePage.context';
import { HomePageComponent } from '@web/src/modules/browse/components/HomePageComponent';

async function fetchRecentSongs() {
  try {
    const response = await axiosInstance.get<SongPreviewDtoType[]>(
      '/song-browser/recent',
      {
        params: {
          page: 1, // TODO: fiz constants
          limit: 16, // TODO: change 'limit' parameter to 'skip' and load 12 songs initially, then load 8 more songs on each pagination
          sort: 'recent',
          order: false,
        },
      },
    );

    return response.data;
  } catch (error) {
    return [];
  }
}

async function fetchFeaturedSongs(): Promise<FeaturedSongsDtoType> {
  try {
    const response = await axiosInstance.get<FeaturedSongsDtoType>(
      '/song-browser/featured',
    );

    return response.data;
  } catch (error) {
    return {
      hour: [],
      day: [],
      week: [],
      month: [],
      year: [],
      all: [],
    };
  }
}

export const metadata: Metadata = {
  title: 'Songs',
};

async function Home() {
  const recentSongs = await fetchRecentSongs();
  const featuredSongs = await fetchFeaturedSongs();

  return (
    <HomePageProvider
      initialRecentSongs={recentSongs}
      initialFeaturedSongs={featuredSongs}
    >
      <HomePageComponent />
    </HomePageProvider>
  );
}

export default Home;
