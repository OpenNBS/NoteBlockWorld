import axiosInstance from '@web/src/lib/axios';
import { HomePageProvider } from '@web/src/modules/browse/components/client/HomePage.context';
import HomePageComponent from '@web/src/modules/browse/components/HomePageComponent';
import { SongPreview } from '@web/src/modules/browse/types';

async function fetchRecentSongs(): Promise<SongPreview[]> {
  try {
    const response = await axiosInstance.get('/song', {
      params: { sort: 'createdAt', limit: 8 },
    });
    return response.data;
  } catch (error) {
    console.error('Error loading recent songs:', error);
    return [];
  }
}

async function fetchFeaturedSongs(): Promise<SongPreview[]> {
  try {
    const response = await axiosInstance.get('/song', {
      params: { sort: 'createdAt', limit: 4 }, // TODO: featured
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
