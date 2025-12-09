'use client';

import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  InterSectionAdSlot,
  SongCardAdSlot,
} from '../../shared/components/client/ads/AdSlots';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../shared/components/client/Carousel';
import { WelcomeBanner } from '../WelcomeBanner';

import { CategoryButtonGroup } from './client/CategoryButton';
import { useFeaturedSongsProvider } from './client/context/FeaturedSongs.context';
import {
  useRecentSongsProvider,
  useRecentSongsPageLoader,
  useRecentSongsCategoriesLoader,
} from './client/context/RecentSongs.context';
import LoadMoreButton from './client/LoadMoreButton';
import { TimespanButtonGroup } from './client/TimespanButton';
import SongCard from './SongCard';
import SongCardGroup from './SongCardGroup';

export const HomePageComponent = () => {
  // Initialize sync hooks for proper effect handling
  useRecentSongsPageLoader();
  useRecentSongsCategoriesLoader();

  const { featuredSongsPage, timespan } = useFeaturedSongsProvider();
  const { recentSongs, increasePageRecent, hasMore } = useRecentSongsProvider();
  return (
    <>
      {/* Welcome banner/Hero */}
      <WelcomeBanner />
      {/* <EventBanner /> */}

      {/* FEATURED SONGS */}
      {featuredSongsPage.length > 0 && (
        <>
          <div className='flex flex-wrap justify-between gap-6 text-nowrap'>
            <h2 className='flex-1 text-xl uppercase'>Featured songs</h2>
            <TimespanButtonGroup />
          </div>
          <div className='h-6' />

          <Carousel
            key={timespan}
            opts={{
              align: 'start',
              loop: false,
              duration: 15,
            }}
          >
            <CarouselContent className='-ml-4'>
              {featuredSongsPage.map((song, i) => (
                <CarouselItem
                  className='basis-full md:basis-1/2 lg:basis-1/3 min-w-0 shrink-0 grow-0 pl-4'
                  key={i}
                >
                  <SongCard song={song} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselDots />
          </Carousel>

          <hr className='my-8 border-none bg-zinc-700 h-[3px]' />
        </>
      )}

      <InterSectionAdSlot />

      {/* RECENT SONGS */}
      <div className='flex flex-row flex-wrap justify-between items-center gap-4 mb-2'>
        <h2 className='text-xl uppercase z-[2]'>Recent songs</h2>
        <CategoryButtonGroup />
      </div>
      <div className='h-6' />
      <SongCardGroup data-test='recent-songs'>
        {(recentSongs || []).map((song, i) =>
          song === undefined || song === null ? (
            <SongCardAdSlot key={i} />
          ) : (
            <SongCard key={i} song={song} />
          ),
        )}
      </SongCardGroup>
      <div className='flex flex-col w-full justify-between items-center mt-4'>
        {hasMore ? (
          <LoadMoreButton onClick={() => increasePageRecent()} />
        ) : (
          <FontAwesomeIcon
            icon={faEllipsis}
            className='text-2xl text-zinc-500'
          />
        )}
      </div>
    </>
  );
};
