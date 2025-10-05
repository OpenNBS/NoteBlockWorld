import { cookies } from 'next/headers';
import Image from 'next/image';

import type { SongPreviewDtoType, SongViewDtoType } from '@nbw/database';
import axios from '@web/lib/axios';

import SongCard from '../../browse/components/SongCard';
import SongCardGroup from '../../browse/components/SongCardGroup';
import { MultiplexAdSlot } from '../../shared/components/client/ads/AdSlots';
import { ErrorBox } from '../../shared/components/client/ErrorBox';
import { formatTimeAgo } from '../../shared/util/format';

import { LicenseInfo } from './client/LicenseInfo';
import { SongDetails } from './SongDetails';
import {
  DownloadSongButton,
  OpenSongInNBSButton,
  ShareButton,
  UploaderBadge,
  VisibilityBadge,
} from './SongPageButtons';

export async function SongPage({ id }: { id: string }) {
  let song: SongViewDtoType;

  // get 'token' cookie from headers
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || null;

  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axios.get<SongViewDtoType>(`/song/${id}`, {
      headers,
    });

    song = await response.data;
  } catch {
    return <ErrorBox message='An error occurred while retrieving the song' />;
  }

  let suggestions: SongPreviewDtoType[] = [];

  try {
    const response = await axios.get<SongPreviewDtoType[]>(
      `/song-browser/random`,
      {
        params: {
          count: 4,
          category: song.category,
        },
      },
    );

    suggestions = await response.data;
  } catch {
    console.error('Failed to retrieve suggested songs');
  }

  return (
    <>
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

          <div className='text-xl font-bold inline'>
            <h1 className='inline'>{song.title}</h1>
            {song.visibility === 'private' && (
              <>
                <span className='inline-block w-3 align-middle' />
                <VisibilityBadge />
              </>
            )}
          </div>

          {/* Uploader and actions */}
          <div className='flex flex-row flex-wrap justify-start items-center gap-8 w-full'>
            <UploaderBadge user={song.uploader} />
            {/* <FollowButton /> */}
            <div className='flex-grow'></div>
            <div className='flex flex-row gap-4 overflow-x-auto'>
              {/* <LikeButton /> */}
              {song.visibility !== 'private' && (
                <ShareButton songId={song.publicId} />
              )}
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
            <LicenseInfo license={song.license} />
          </div>
        </div>

        {/* Right panel - song details */}
        <div className='col-span-full lg:col-span-3'>
          <SongDetails song={song} />
        </div>
      </div>
      <MultiplexAdSlot className='mb-0' />

      {/* Suggested songs */}
      <h2 className='text-md uppercase text-zinc-400 mt-10 mb-2'>
        You might also like
      </h2>
      <SongCardGroup>
        {suggestions.map((suggestion) => (
          <SongCard key={suggestion.publicId} song={suggestion} />
        ))}
      </SongCardGroup>
    </>
  );
}
