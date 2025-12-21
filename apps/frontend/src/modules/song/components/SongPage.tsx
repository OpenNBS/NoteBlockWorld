import { cookies } from 'next/headers';
import Image from 'next/image';

import type {
  PageDto,
  SongPreviewDtoType,
  SongViewDtoType,
} from '@nbw/database';
import axios from '@web/lib/axios';

import SongCard from '@web/modules/browse/components/SongCard';
import SongCardGroup from '@web/modules/browse/components/SongCardGroup';
import { MultiplexAdSlot } from '@web/modules/shared/components/client/ads/AdSlots';

import { formatTimeAgo } from '@web/modules/shared/util/format';

import { ErrorBox } from '@web/modules/shared/components/client/ErrorBox';
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
    const response = await axios.get<PageDto<SongPreviewDtoType>>(`/song`, {
      params: {
        sort: 'random',
        limit: 4,
        category: song.category,
      },
    });

    suggestions = await response.data.content;
  } catch {
    console.error('Failed to retrieve suggested songs');
  }

  // TODO: Check if the image is from localhost to avoid Next.js 15 private IP errors
  // Next.js 15 blocks images from private IPs (localhost, 127.0.0.1, ::1) for security reasons.
  // This is related to CVE-2025-55173 security vulnerability.
  // Sources:
  // - https://nextjs.org/blog/next-15 (Next.js 15 release notes)
  // - https://advisories.gitlab.com/pkg/npm/next/CVE-2025-55173/ (Security advisory)
  // - https://github.com/vercel/next.js/discussions/50617 (GitHub discussion)
  // - https://learnspace.blog/blog/the-right-way-to-handle-images-in-next-js-15
  // Workaround: Use unoptimized={true} for localhost images to bypass the optimization API
  // which triggers the private IP check. This only affects development; production images
  // from external sources will still be optimized.
  const isLocalhost =
    song.thumbnailUrl.startsWith('http://localhost') ||
    song.thumbnailUrl.startsWith('http://127.0.0.1') ||
    song.thumbnailUrl.startsWith('http://[::1]');

  return (
    <>
      <div className='grid grid-cols-8 gap-12'>
        <div className='col-span-full lg:col-span-5 flex flex-col gap-4'>
          {/* Song thumbnail */}
          {/* TODO: implement loading https://github.com/vercel/next.js/discussions/50617 */}
          <picture className='bg-zinc-800 aspect-5/3 rounded-xl'>
            <Image
              unoptimized={isLocalhost}
              alt='Song thumbnail'
              width={1280}
              height={720}
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
