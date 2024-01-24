'use client';

import SongCard from '@web/src/components/Song/SongCard';
import { TimespanButton } from '@web/src/components/Song/TimespanButton';
import styled from 'styled-components';

const TimespanButtonGroup = () => {
  return (
    <div className='flex flex-row gap-3 overflow-x-auto'>
      <TimespanButton
        id='hour'
        isActive={true}
        isDisabled={false}
        onClick={() => {}}
      >
        past hour
      </TimespanButton>
      <TimespanButton
        id='day'
        isActive={false}
        isDisabled={false}
        onClick={() => {}}
      >
        past day
      </TimespanButton>
      <TimespanButton
        id='week'
        isActive={false}
        isDisabled={false}
        onClick={() => {}}
      >
        past week
      </TimespanButton>
      <TimespanButton
        id='month'
        isActive={false}
        isDisabled={false}
        onClick={() => {}}
      >
        past month
      </TimespanButton>
      <TimespanButton
        id='year'
        isActive={false}
        isDisabled={false}
        onClick={() => {}}
      >
        past year
      </TimespanButton>
    </div>
  );
};

const SongCardGroup = styled.div.attrs({
  className:
    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full items-center gap-4',
})``;

export default function Home() {
  return (
    <main>
      {/* FEATURED SONGS */}
      <div className='flex flex-col md:flex-row justify-between gap-4'>
        <h2 className='flex-1 text-xl uppercase'>Featured songs</h2>
        <div className='flex-0'>
          <TimespanButtonGroup />
        </div>
      </div>
      <div className='h-6' />
      <SongCardGroup>
        <SongCard />
        <SongCard />
        <SongCard />
        <SongCard />
        <SongCard />
        <SongCard />
      </SongCardGroup>
      <hr className='my-8 border-none bg-zinc-700 h-[3px]' />

      {/* RECENT SONGS */}
      <div className='flex flex-row justify-between items-center gap-4'>
        <h2 className='text-xl uppercase'>Recent songs</h2>
      </div>
      <div className='h-6' />
      <SongCardGroup>
        <SongCard />
        <SongCard />
        <SongCard />
        <SongCard />
        <SongCard />
        <SongCard />
      </SongCardGroup>
    </main>
  );
}
