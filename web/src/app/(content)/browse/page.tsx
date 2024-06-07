import { PageQueryDTOType } from '@shared/validation/common/dto/types';

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

async function Home() {
  // TODO: implement server fetching again
  //const recentSongs = await fetchRecentSongs();
  //const featuredSongs = await fetchFeaturedSongs();

  return (
    <HomePageProvider
      initialRecentSongs={Array(8).fill(null)}
      initialFeaturedSongs={Array(5).fill(null)}
    >
      <HomePageComponent />
    </HomePageProvider>
  );
}

export default Home;
