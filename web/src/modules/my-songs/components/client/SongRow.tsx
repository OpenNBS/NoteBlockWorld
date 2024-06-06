import {
  faCirclePlay,
  faEye,
  faEyeSlash,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SongPreviewDtoType } from '@shared/validation/song/dto/types';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

import SongThumbnail from '@web/src/modules/shared/components/layout/SongThumbnail';
import { formatDuration } from '@web/src/modules/shared/util/format';

import { useMySongsProvider } from './context/MySongs.context';
import {
  DeleteButton,
  DownloadSongButton,
  EditButton,
} from '../client/MySongsButtons';

export const SongRow = ({ song }: { song: SongPreviewDtoType | null }) => {
  const { setIsDeleteDialogOpen, setSongToDelete } = useMySongsProvider();

  const onDeleteClicked = () => {
    if (!song) return;
    setSongToDelete(song);
    setIsDeleteDialogOpen(true);
  };

  const getDescription = (description: string | null) => {
    const maxDisplayLength = 50;
    if (description) {
      const length = description.length;
      if (length > maxDisplayLength) {
        return description.slice(0, maxDisplayLength) + '...';
      }
      return description;
    } else {
      return 'No description';
    }
  };
  return (
    <article className='grid grid-cols-8 border border-zinc-700 border-t-0 last:border-b-0 hover:bg-zinc-950/50 transition-colors duration-150 [&>div]:p-2 [&>div]:my-auto'>
      {/* Thumbnail */}
      <div className='col-span-1'>
        <div className='aspect-[5/3] my-1.5 min-w-20 max-h-28 object-cover rounded-lg relative block leading-none'>
          {!song ? (
            <Skeleton className='w-full h-full' />
          ) : (
            <>
              <SongThumbnail src={song.thumbnailUrl} />
              <div className='absolute bottom-0 right-0 m-1.5 px-1 py-0.5 bg-zinc-900/80 rounded-md'>
                <span className='text-white font-semibold text-md'>
                  {formatDuration(song.duration)}
                </span>
              </div>
              <Link
                href={`/song/${song.publicId}`}
                className='flex items-center justify-center absolute bottom-0 right-0 top-0 left-0 rounded-lg bg-black opacity-0 hover:opacity-40 cursor-pointer transition-all duration-200'
              >
                <FontAwesomeIcon
                  icon={faCirclePlay}
                  className='text-white w-12 h-12'
                />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Song */}
      <div className='col-span-3 text-wrap'>
        <div className='flex flex-col justify-center gap-1 text-left max-w-96'>
          {!song ? (
            <Skeleton className='w-1/2' />
          ) : (
            <Link
              href={`/song/${song.publicId}/edit`}
              className='line-clamp-2 text-ellipsis text-md font-medium leading-tight hover:underline cursor-pointer'
            >
              {song.title}
            </Link>
          )}
          {!song ? (
            <Skeleton />
          ) : (
            <p
              className={`line-clamp-3 text-ellipsis text-sm leading-tight ${
                !song.description ? 'text-zinc-500 italic' : 'text-zinc-400'
              }`}
            >
              {getDescription(song.description)}
            </p>
          )}
        </div>
      </div>

      {/* Visibility */}
      <div>
        <div className='flex flex-col items-center gap-1'>
          {!song ? (
            <Skeleton className='h-8 w-8' />
          ) : (
            <FontAwesomeIcon
              icon={song.visibility === 'private' ? faEyeSlash : faEye}
              className='text-lg w-6'
            />
          )}
          <div className='w-1/2'>
            {!song ? (
              <Skeleton />
            ) : (
              <>
                {song.visibility?.charAt(0).toUpperCase() +
                  song.visibility?.slice(1)}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Created at */}
      <div>
        {!song ? (
          <Skeleton />
        ) : (
          <>
            {new Date(song.createdAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </>
        )}
      </div>

      {/* Play count */}
      <div className='w-1/2 mx-auto'>
        {!song ? (
          <Skeleton />
        ) : (
          <div className='flex flex-row items-center justify-center gap-1.5'>
            <FontAwesomeIcon icon={faPlay} className='text-sm w-2.5' />
            <span className='text-lg font-bold'>{song.playCount}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div>
        <div className='flex flex-row items-center justify-center text-xl *:w-8'>
          {/* TODO: add popups/tooltips */}
          {!song ? (
            <Skeleton className='h-8' />
          ) : (
            <DownloadSongButton song={song} />
          )}
          {!song ? (
            <Skeleton className='h-8' />
          ) : (
            <EditButton songId={song.publicId} />
          )}
          {!song ? (
            <Skeleton className='h-8' />
          ) : (
            <DeleteButton onClick={onDeleteClicked} />
          )}
        </div>
      </div>
    </article>
  );
};
