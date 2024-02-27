import { TimespanButtonGroup } from '@web/src/modules/browse/components/client/TimespanButton';
import SongCard from '@web/src/modules/browse/components/SongCard';
import SongCardGroup from '@web/src/modules/browse/components/SongCardGroup';

export default function Home() {
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
    </>
  );
}
