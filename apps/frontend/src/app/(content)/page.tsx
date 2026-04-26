import { Metadata } from 'next';

import { BROWSER_SONGS } from '@nbw/config';
import type { FeaturedSongsDto, PageDto, SongPreviewDto } from '@nbw/database';
import axiosInstance from '@web/lib/axios';
import { HomePageProvider } from '@web/modules/browse/components/client/context/HomePage.context';
import { HomePageComponent } from '@web/modules/browse/components/HomePageComponent';

async function fetchRecentSongs() {
  try {
    const response = await axiosInstance.get<PageDto<SongPreviewDto>>('/song', {
      params: {
        page: 1,
        limit: BROWSER_SONGS.recentFetchCount,
        sort: 'recent',
        order: 'desc',
      },
    });

    return response.data.content;
  } catch (error) {
    return [];
  }
}

async function fetchFeaturedSongs(): Promise<FeaturedSongsDto> {
  try {
    const response = await axiosInstance.get<FeaturedSongsDto>(
      '/song/featured',
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
