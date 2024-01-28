import { SongType } from '@web/src/types/Song';
import styled from 'styled-components';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type SongCardProps = {
  song: SongType;
};

const SongCard = ({ song }: Partial<SongCardProps>) => {
  return (
    <div className='flex flex-col gap-2 pb-2 bg-zinc-800  hover:bg-zinc-700 rounded-lg hover:scale-105 cursor-pointer w-fit h-fit transition-all duration-200'>
      {/* Song image */}
      <div className='w-full object-cover rounded-lg relative'>
        <img
          src='/demo.png'
          alt='Song cover'
          className='w-full h-full object-cover rounded-lg'
        />
        <div className='absolute bottom-0 right-0 m-1 px-1 py-0.5 bg-zinc-800 rounded-md'>
          <span className='text-white font-semibold'>3:08</span>
        </div>
      </div>

      {/* Song info */}
      <div className='flex flex-row justify-between px-4 pt-0.5 text-pretty'>
        {/* Song title */}
        <h3 className='text-md font-semibold leading-tight h-10'>
          Cosmic Cove Galaxy - Super Mario Galaxy 2
        </h3>
      </div>
      <div className='flex flex-row justify-between items-center px-4'>
        {/* Song author */}
        <p className='text-sm text-zinc-400'>Bentroen • 3 days ago</p>
        {/* Play icon & count */}
        <div className='text-md flex items-center gap-1'>
          <FontAwesomeIcon icon={faPlay} className='text-xs' />
          <span className='text-md font-semibold'>923</span>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
