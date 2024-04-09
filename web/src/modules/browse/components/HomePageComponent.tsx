'use client';

import { useHomePageProvider } from './client/HomePage.context';
import { TimespanButtonGroup } from './client/TimespanButton';
import SongCard from './SongCard';
import SongCardGroup from './SongCardGroup';

const HomePageComponent = () => {
  const { recentSongs, featuredSongs } = useHomePageProvider();

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
      <SongCardGroup>
        {featuredSongs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </SongCardGroup>
      <hr className='my-8 border-none bg-zinc-700 h-[3px]' />

      {/* RECENT SONGS */}
      <div className='flex flex-row justify-between items-center gap-4'>
        <h2 className='text-xl uppercase'>Recent songs</h2>
      </div>
      <div className='h-6' />
      <SongCardGroup>
        {recentSongs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </SongCardGroup>
    </>
  );
};

export default HomePageComponent;
