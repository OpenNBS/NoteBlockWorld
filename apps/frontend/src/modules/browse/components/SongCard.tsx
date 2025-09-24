'use client';

import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SongPreviewDtoType } from '@nbw/database';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

import { formatDuration, formatTimeAgo } from '@web/modules/shared/util/format';


import SongThumbnail from '../../shared/components/layout/SongThumbnail';

const SongDataDisplay = ({ song }: { song: SongPreviewDtoType | null }) => {
  return (
    <div className='flex flex-col gap-2 pb-2 h-full'>
      {/* Song image */}
      <div className='relative'>
        {!song ? (
          <Skeleton
            className='w-full h-full rounded-lg aspect-[5/3] object-cover'
            containerClassName='block leading-none'
          />
        ) : (
          <>
            <SongThumbnail src={song.thumbnailUrl} />
            <div className='absolute bottom-0 right-0 m-1 px-1 py-0.5 bg-zinc-800 rounded-md'>
              <span className='text-white font-semibold'>
                {formatDuration(song.duration)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Song info */}
      <div className='flex flex-row justify-between px-4 pt-0.5 text-pretty flex-grow'>
        {/* Song title */}
        <h3 className='text-md font-semibold leading-tight w-full h-10 flex-grow line-clamp-2'>
          {song?.title || <Skeleton count={2} />}
        </h3>
      </div>
      <div className='flex flex-row justify-between items-center gap-4 px-4'>
        {/* Song author */}
        <p className='text-sm text-zinc-400 flex-1'>
          {!song ? (
            <Skeleton />
          ) : (
            `${song.uploader.username} • ${formatTimeAgo(
              new Date(song.createdAt),
            )}`
          )}
        </p>
        {/* Play icon & count */}
        <div className='text-md flex items-center gap-1 flex-shrink'>
          {!song ? (
            <Skeleton className='min-w-16' />
          ) : (
            <>
              <FontAwesomeIcon icon={faPlay} className='text-xs' />
              <span className='text-md font-semibold'>{song.playCount}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const SongCard = ({ song }: { song: SongPreviewDtoType | null }) => {
  return !song ? (
    <SongDataDisplay song={song} />
  ) : (
    <Link href={`/song/${song.publicId}`} className='h-full max-h-fit'>
      <div
        className='bg-zinc-800 hover:scale-105 hover:bg-zinc-700 rounded-lg cursor-pointer w-full h-full transition-all duration-200'
        style={{ backfaceVisibility: 'hidden' }}
      >
        <SongDataDisplay song={song} />
      </div>
    </Link>
  );
};

export default SongCard;
