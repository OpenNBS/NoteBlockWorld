'use client';

import { useFeaturedSongsProvider } from './client/context/FeaturedSongs.context';
import { useRecentSongsProvider } from './client/context/RecentSongs.context';
import LoadMoreButton from './client/LoadMoreButton';
import { TimespanButtonGroup } from './client/TimespanButton';
import SongCard from './SongCard';
import SongCardGroup from './SongCardGroup';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../shared/components/client/Carousel';

export const HomePageComponent = () => {
  const { featuredSongs } = useFeaturedSongsProvider();

  const { recentSongs, increasePageRecent } = useRecentSongsProvider();

  return (
    <>
      {/* FEATURED SONGS */}
      <div className='flex flex-wrap justify-between gap-6 text-nowrap'>
        <h2 className='flex-1 text-xl uppercase'>Featured songs</h2>
        <TimespanButtonGroup />
      </div>
      <div className='h-6' />
      <Carousel
        opts={{
          align: 'start',
          loop: false,
          duration: 15,
        }}
      >
        <CarouselContent>
          {featuredSongs.map((song, i) => (
            <CarouselItem
              className='basis-full md:basis-1/2 lg:basis-1/3'
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

      {/* RECENT SONGS */}
      <div className='flex flex-row justify-between items-center gap-4'>
        <h2 className='text-xl uppercase'>Recent songs</h2>
      </div>
      <div className='h-6' />
      <SongCardGroup data-test='recent-songs'>
        {recentSongs.map((song, i) => (
          <SongCard key={i} song={song} />
        ))}
        <LoadMoreButton onClick={() => increasePageRecent()} />
      </SongCardGroup>
    </>
  );
};
