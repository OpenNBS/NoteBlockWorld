import { PageQueryDTOType } from '@shared/validation/common/dto/types';
import { SongPreviewDtoType } from '@shared/validation/song/dto/types';

import axiosInstance from '@web/src/lib/axios';
import { HomePageProvider } from '@web/src/modules/browse/components/client/HomePage.context';
import { HomePageComponent } from '@web/src/modules/browse/components/HomePageComponent';

const recentSongsParams: PageQueryDTOType = {
  page: 1, // TODO: fiz constants
  limit: 10,
  sort: 'createdAt',
  order: false,
  timespan: 'week',
};
const featuredSongsParams: PageQueryDTOType = {
  page: 1, // TODO: fiz constants
  limit: 10,
  sort: 'playCount',
  order: false,
  timespan: 'week',
};
async function fetchRecentSongs(): Promise<SongPreviewDtoType[]> {
  try {
    const response = await axiosInstance.get('/song', {
      params: recentSongsParams,
    });
    return response.data;
  } catch (error) {
    console.error('Error loading recent songs:', error);
    return [];
  }
}

async function fetchFeaturedSongs(): Promise<SongPreviewDtoType[]> {
  try {
    const response = await axiosInstance.get('/song', {
      params: featuredSongsParams,
    });
    return response.data;
  } catch (error) {
    console.error('Error loading featured songs:', error);
    return [];
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
