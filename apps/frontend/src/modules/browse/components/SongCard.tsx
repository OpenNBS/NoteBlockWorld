'use client';

import {
  faCirclePause,
  faCirclePlay,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

import type { SongPreviewDtoType } from '@nbw/database';
import { cn } from '@web/lib/utils';
import { formatDuration, formatTimeAgo } from '@web/modules/shared/util/format';
import {
  previewToPlayingSong,
  useSongPlayer,
} from '@web/modules/song/components/client/context/SongPlayer.context';

import SongThumbnail from '../../shared/components/layout/SongThumbnail';

const SongDataDisplay = ({ song }: { song: SongPreviewDtoType | null }) => {
  return (
    <div className='flex flex-col gap-2 pb-2 h-full'>
      {/* Song image */}
      <div className='relative'>
        {!song ? (
          <Skeleton
            className='w-full h-full rounded-lg aspect-5/3 object-cover'
            containerClassName='block leading-none'
          />
        ) : (
          <>
            <SongThumbnail src={song.thumbnailUrl} />
            <div className='absolute bottom-0 right-0 m-1 px-1 py-0.5 bg-zinc-900/50 rounded-md backdrop-blur-md'>
              <span className='text-white font-semibold'>
                {formatDuration(song.duration)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Song info */}
      <div className='flex flex-row justify-between px-4 pt-0.5 text-pretty grow'>
        {/* Song title */}
        <h3 className='text-md font-semibold leading-tight w-full h-10 grow line-clamp-2'>
          {song?.title || <Skeleton count={2} />}
        </h3>
      </div>
      <div className='flex flex-row justify-between items-center gap-4 px-4'>
        {/* Song author */}
        <p className='text-sm text-zinc-400 flex-1 text-pretty leading-tight'>
          {!song ? (
            <Skeleton />
          ) : (
            `${song.uploader.username} • ${formatTimeAgo(
              new Date(song.createdAt),
            )}`
          )}
        </p>
        {/* Play icon & count */}
        <div className='text-md flex items-center gap-1 shrink'>
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
  const { playSong, currentSong, isPlaying, isLoading } = useSongPlayer();

  if (!song) {
    return <SongDataDisplay song={song} />;
  }

  const isCurrent = currentSong?.publicId === song.publicId;
  const showPause = isCurrent && isPlaying;

  const handlePlay = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    void playSong(previewToPlayingSong(song));
  };

  return (
    <div
      className='group relative bg-zinc-800 hover:scale-105 hover:bg-zinc-700 rounded-lg cursor-pointer w-full h-full max-h-fit transition-all duration-200'
      style={{ backfaceVisibility: 'hidden' }}
    >
      <Link href={`/song/${song.publicId}`} className='block h-full max-h-fit'>
        <SongDataDisplay song={song} />
      </Link>
      <div
        className={cn(
          'absolute top-0 left-0 w-full aspect-5/3 rounded-lg bg-black flex items-center justify-center pointer-events-none transition-all duration-200',
          isCurrent ? 'opacity-40' : 'opacity-0 group-hover:opacity-40',
        )}
      >
        <button
          type='button'
          disabled={isCurrent && isLoading}
          onClick={handlePlay}
          className={cn(
            'pointer-events-none group-hover:pointer-events-auto text-white text-6xl hover:scale-110 transition-transform duration-200 disabled:opacity-60',
            isCurrent && 'pointer-events-auto',
          )}
          aria-label={showPause ? 'Pause song' : 'Play song'}
          title={showPause ? 'Pause' : 'Play'}
        >
          <FontAwesomeIcon icon={showPause ? faCirclePause : faCirclePlay} />
        </button>
      </div>
    </div>
  );
};

export default SongCard;
