import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import removeMarkdown from 'remove-markdown';

import { getViewerUserId } from '@web/modules/auth/features/auth.utils';
import SongCard from '@web/modules/browse/components/SongCard';
import { ProfileBioEditor } from '@web/modules/user/components/client/ProfileBioEditor';
import { ProfilePublicNameEditor } from '@web/modules/user/components/client/ProfilePublicNameEditor';
import {
  fetchPublicProfileByUsername,
  fetchUserSongsByUploader,
} from '@web/modules/user/features/profile.util';

const SONGS_PAGE_SIZE = 10;

type PageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  try {
    const profile = await fetchPublicProfileByUsername(username);
    const plain = removeMarkdown(profile.description || '').slice(0, 160);
    return {
      title: `${profile.publicName} (@${profile.username})`,
      description: plain || `Profile of ${profile.publicName}`,
    };
  } catch {
    return { title: 'Profile' };
  }
}

const UserProfilePage = async ({ params, searchParams }: PageProps) => {
  const { username } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1);

  let profile;
  try {
    profile = await fetchPublicProfileByUsername(username);
  } catch {
    notFound();
  }

  const [viewerId, songsPage] = await Promise.all([
    getViewerUserId(),
    fetchUserSongsByUploader(profile.username, page, SONGS_PAGE_SIZE),
  ]);

  const isOwner = viewerId !== null && viewerId === profile.id;
  const totalPages = Math.max(1, Math.ceil(songsPage.total / songsPage.limit));
  const hasSongs = songsPage.total > 0;
  const socialEntries = Object.entries(profile.socialLinks ?? {}).filter(
    ([, href]) => Boolean(href),
  );

  return (
    <main className='w-full max-w-5xl mx-auto px-4 py-8 text-left'>
      <div className='flex flex-col sm:flex-row gap-6 items-start'>
        <Image
          src={profile.profileImage}
          alt=''
          width={128}
          height={128}
          unoptimized
          className='w-32 h-32 rounded-full object-cover shrink-0 bg-zinc-800'
        />
        <div className='min-w-0 flex-1'>
          <ProfilePublicNameEditor profile={profile} isOwner={isOwner} />
          <p className='text-zinc-500'>@{profile.username}</p>
          {socialEntries.length > 0 && (
            <ul className='mt-3 flex flex-wrap gap-3'>
              {socialEntries.map(([key, href]) => (
                <li key={key}>
                  <a
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-400 hover:text-blue-300 text-sm capitalize'
                  >
                    {key}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ProfileBioEditor profile={profile} isOwner={isOwner} />

      {(hasSongs || isOwner) && (
        <section className='mt-10'>
          <h2 className='text-xl font-semibold text-zinc-200 mb-4'>Songs</h2>
          {hasSongs ? (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {songsPage.content.map((song) => (
                  <SongCard key={song.publicId} song={song} />
                ))}
              </div>
              {totalPages > 1 && (
                <nav
                  className='flex flex-wrap items-center gap-3 mt-8'
                  aria-label='Song pagination'
                >
                  {page > 1 && (
                    <Link
                      href={`?page=${page - 1}`}
                      className='text-blue-400 hover:text-blue-300'
                    >
                      Previous
                    </Link>
                  )}
                  <span className='text-zinc-500 text-sm'>
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={`?page=${page + 1}`}
                      className='text-blue-400 hover:text-blue-300'
                    >
                      Next
                    </Link>
                  )}
                </nav>
              )}
            </>
          ) : (
            <div className='flex flex-col gap-3 items-start'>
              <p className='text-zinc-500'>No public songs yet.</p>
              <Link
                href='/upload'
                className='text-blue-400 hover:text-blue-300 text-sm font-medium'
              >
                Upload a song
              </Link>
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default UserProfilePage;
