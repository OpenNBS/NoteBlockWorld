import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';

import {
  formatDuration,
  formatTimeAgo,
} from '@web/src/modules/shared/util/format';

import { SongPreview } from '../types';

const SongCard = ({ song }: { song: SongPreview }) => {
  return (
    <Link href={`/song/${song.publicId}`}>
      <div className='flex flex-col gap-2 pb-2 bg-zinc-800  hover:bg-zinc-700 rounded-lg hover:scale-105 cursor-pointer w-full h-full transition-all duration-200'>
        {/* Song image */}
        <div className='w-full aspect-[5/3] object-cover rounded-lg relative'>
          <Image
            src={song.thumbnailUrl || '/demo.png'}
            width={640}
            height={384}
            alt='Song cover'
            className='w-full h-full object-cover rounded-lg'
          />
          <div className='absolute bottom-0 right-0 m-1 px-1 py-0.5 bg-zinc-800 rounded-md'>
            <span className='text-white font-semibold'>
              {formatDuration(song.duration)}
            </span>
          </div>
        </div>

        {/* Song info */}
        <div className='flex flex-row justify-between px-4 pt-0.5 text-pretty'>
          {/* Song title */}
          <h3 className='text-md font-semibold leading-tight h-10'>
            {song.title}
          </h3>
        </div>
        <div className='flex flex-row justify-between items-center px-4'>
          {/* Song author */}
          <p className='text-sm text-zinc-400'>
            {song.uploader.username} • {formatTimeAgo(new Date(song.createdAt))}
          </p>
          {/* Play icon & count */}
          <div className='text-md flex items-center gap-1'>
            <FontAwesomeIcon icon={faPlay} className='text-xs' />
            <span className='text-md font-semibold'>{song.playCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SongCard;
