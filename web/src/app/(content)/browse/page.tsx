import { PageQueryDTOType } from '@shared/validation/common/dto/types';
import {
  FeaturedSongsDtoType,
  SongPreviewDtoType,
} from '@shared/validation/song/dto/types';

import axiosInstance from '@web/src/lib/axios';
import { HomePageProvider } from '@web/src/modules/browse/components/client/context/HomePage.context';
import { HomePageComponent } from '@web/src/modules/browse/components/HomePageComponent';

const recentSongsParams: PageQueryDTOType = {
  page: 1, // TODO: fiz constants
  limit: 12,
  sort: 'recent',
  order: false,
};

async function fetchRecentSongs() {
  try {
    const response = await axiosInstance.get<SongPreviewDtoType[]>('/song', {
      params: recentSongsParams,
    });

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
