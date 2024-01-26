import { SongType } from '@web/src/types/Song';
import styled from 'styled-components';

type SongCardProps = {
  song: SongType;
};

const SongCard = ({ song }: Partial<SongCardProps>) => {
  return (
    <div className='flex flex-col gap-2 bg-zinc-800  hover:bg-zinc-700 rounded-lg hover:scale-105 cursor-pointer w-fit h-60 transition-all duration-200'>
      {/* Song image */}
      <div className='h-40 w-full object-cover rounded-lg'>
        <img
          src='/demo.png'
          alt='Song cover'
          className='w-full h-full object-cover rounded-lg'
        />
      </div>

      {/* Song info */}
      <div className='flex flex-col gap-1 px-4'>
        {/* Song title */}
        <h3 className='text-lg font-semibold'>Song title</h3>
        {/* Song author */}
        <p className='text-sm'>by author</p>
      </div>
    </div>
  );
};

export default SongCard;
