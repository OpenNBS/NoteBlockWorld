import { SongViewDtoType } from '@shared/validation/song/dto/types';
import Image from 'next/image';

import axios from '@web/src/lib/axios';

import { SongDetails } from './SongDetails';
import {
  DownloadSongButton,
  OpenSongInNBSButton,
  ShareButton,
  UploaderBadge,
} from './SongPageButtons';
import { ErrorBox } from '../../shared/components/client/ErrorBox';
import { formatTimeAgo } from '../../shared/util/format';

export async function SongPage({ id }: { id: string }) {
  let song;

  try {
    const response = await axios.get<SongViewDtoType>(`/song/${id}`);
    song = await response.data;
  } catch {
    return <ErrorBox message='An error occurred while retrieving the song' />;
  }

  return (
    <div className='grid grid-cols-8 gap-12'>
      <div className='col-span-full lg:col-span-5 flex flex-col gap-4'>
        {/* Song thumbnail */}
        {/* TODO: implement loading https://github.com/vercel/next.js/discussions/50617 */}
        <picture className='bg-zinc-800 aspect-[5/3] rounded-xl'>
          <Image
            width={1280}
            height={720}
            alt='Song thumbnail'
            src={song.thumbnailUrl}
            className='w-full h-full rounded-xl'
          />
        </picture>

        <h1 className='text-xl font-bold'>{song.title}</h1>

        {/* Uploader and actions */}
        <div className='flex flex-row flex-wrap justify-start items-center gap-8 w-full'>
          <UploaderBadge user={song.uploader} />
          {/* <FollowButton /> */}
          <div className='flex-grow'></div>
          <div className='flex flex-row gap-4'>
            {/* <LikeButton /> */}
            <ShareButton songId={song.publicId} />
            <OpenSongInNBSButton song={song} />
            <DownloadSongButton song={song} />
          </div>
        </div>

        {/* Views, upload date, description */}
        <div className='flex flex-col p-3 gap-2 bg-zinc-800 rounded-xl'>
          <div className='text-sm text-zinc-300'>
            {song.playCount} {song.playCount == 1 ? 'view' : 'views'} •{' '}
            {formatTimeAgo(new Date(song.createdAt))}
          </div>
          <p className='leading-tight whitespace-pre-line'>
            {song.description}
          </p>
        </div>
      </div>

      {/* Right panel - song details */}
      <div className='col-span-full lg:col-span-3'>
        <SongDetails song={song} />
      </div>
    </div>
  );
}
