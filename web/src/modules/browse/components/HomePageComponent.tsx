'use client';

import { useFeaturedSongsProvider } from './client/context/FeaturedSongs.context';
import { useRecentSongsProvider } from './client/context/RecentSongs.context';
import LoadMoreButton from './client/LoadMoreButton';
import { TimespanButtonGroup } from './client/TimespanButton';
import SongCard from './SongCard';
import SongCardGroup from './SongCardGroup';

export const HomePageComponent = () => {
  const {
    featuredSongs,
    featuredLoading,
    featuredError,
    increasePageFeatured,
  } = useFeaturedSongsProvider();

  const { recentSongs, recentLoading, recentError, increasePageRecent } =
    useRecentSongsProvider();

  return (
    <>
      {/* FEATURED SONGS */}
      <div className='flex flex-col md:flex-row justify-between gap-4 text-nowrap'>
        <h2 className='flex-1 text-xl uppercase'>Featured songs</h2>
        <div className='flex-0'>
          <TimespanButtonGroup />
        </div>
      </div>
      <div className='h-6' />
      <SongCardGroup data-test='featured-songs'>
        {featuredSongs.map((song) => (
          <SongCard key={song.publicId} song={song} />
        ))}
        <LoadMoreButton onClick={() => increasePageFeatured()} />
      </SongCardGroup>
      <hr className='my-8 border-none bg-zinc-700 h-[3px]' />

      {/* RECENT SONGS */}
      <div className='flex flex-row justify-between items-center gap-4'>
        <h2 className='text-xl uppercase'>Recent songs</h2>
      </div>
      <div className='h-6' />
      <SongCardGroup data-test='recent-songs'>
        {recentSongs.map((song) => (
          <SongCard key={song.publicId} song={song} />
        ))}
        <LoadMoreButton onClick={() => increasePageRecent()} />
      </SongCardGroup>
    </>
  );
};
