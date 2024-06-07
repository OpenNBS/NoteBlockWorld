import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SongPreviewDtoType } from '@shared/validation/song/dto/types';
import Link from 'next/link';
import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';

import {
  formatDuration,
  formatTimeAgo,
} from '@web/src/modules/shared/util/format';

import SongThumbnail from '../../shared/components/layout/SongThumbnail';

const SongDataDisplay = ({ song }: { song: SongPreviewDtoType }) => {
  const formattedTimeAgo = useMemo(
    () => formatTimeAgo(new Date(song.createdAt)),
    [song],
  );
  return (
    <>
      {/* Song image */}

      <div className='relative'>
        <SongThumbnail src={song.thumbnailUrl} />
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
          {song ? song.title : <Skeleton />}
        </h3>
      </div>
      <div className='flex flex-row justify-between items-center px-4'>
        {/* Song author */}
        <p className='text-sm text-zinc-400'>
          <>
            {song.uploader.username} • {formatTimeAgo(new Date(song.createdAt))}
          </>
        </p>
        {/* Play icon & count */}
        <div className='text-md flex items-center gap-1'>
          <FontAwesomeIcon icon={faPlay} className='text-xs' />
          <span className='text-md font-semibold'>{song.playCount}</span>
        </div>
      </div>
    </>
  );
};

const SongCard = ({ song }: { song?: SongPreviewDtoType }) => {
  return (
    <Link href={song ? `/song/${song.publicId}` : '#'}>
      <div className='flex flex-col gap-2 pb-2 bg-zinc-800 hover:scale-105 hover:bg-zinc-700 rounded-lg cursor-pointer w-full h-full transition-all duration-200'>
        {song ? (
          <SongDataDisplay song={song} />
        ) : (
          <Skeleton
            style={{
              height: '100%',
              width: '100%',
            }}
          />
        )}
      </div>
    </Link>
  );
};

export default SongCard;
