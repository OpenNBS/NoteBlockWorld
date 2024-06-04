import { PageQueryDTOType } from '@shared/validation/common/dto/types';
import { SongPreviewDtoType } from '@shared/validation/song/dto/types';

import axiosInstance from '@web/src/lib/axios';
import { HomePageProvider } from '@web/src/modules/browse/components/client/context/HomePage.context';
import { HomePageComponent } from '@web/src/modules/browse/components/HomePageComponent';

const recentSongsParams: PageQueryDTOType = {
  page: 1, // TODO: fiz constants
  limit: 10,
  sort: 'recent',
  order: false,
};
const featuredSongsParams: PageQueryDTOType = {
  page: 1, // TODO: fiz constants
  limit: 10,
  sort: 'featured',
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
  //const recentSongs = await fetchRecentSongs();
  //const featuredSongs = await fetchFeaturedSongs();

  return (
    <HomePageProvider initialRecentSongs={[]} initialFeaturedSongs={[]}>
      <HomePageComponent />
    </HomePageProvider>
  );
}

export default Home;
