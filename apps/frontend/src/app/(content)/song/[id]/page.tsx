import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import { SongViewDtoType } from '@nbw/database';
import axios from '@web/lib/axios';
import { SongPage } from '@web/modules/song/components/SongPage';

interface SongPage {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: SongPage): Promise<Metadata> {
  let song;
  const publicUrl = process.env.NEXT_PUBLIC_URL;

  const { id } = await params;
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
    return {
      title: 'Song not found',
    };
  }

  return {
    title: song.title,
    description: song.description,
    authors: [{ name: song.uploader.username }],
    openGraph: {
      url: publicUrl + '/song/' + song.publicId,
      title: song.title,
      description: song.description,
      siteName: 'Note Block World',
      images: [song.thumbnailUrl],
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

async function Page({ params }: SongPage) {
  const { id } = await params;

  return <SongPage id={id} />;
}

export default Page;
