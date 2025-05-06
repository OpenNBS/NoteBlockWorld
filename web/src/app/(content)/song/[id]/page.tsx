import { SongViewDtoType } from '@shared/validation/song/dto/types';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import axios from '@web/src/lib/axios';
import { SongPage } from '@web/src/modules/song/components/SongPage';

interface SongPage {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: SongPage): Promise<Metadata> {
  let song;
  const publicUrl = process.env.NEXT_PUBLIC_URL;

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || null;

  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axios.get<SongViewDtoType>(`/song/${params.id}`, {
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

function Page({ params }: SongPage) {
  const { id } = params;

  return <SongPage id={id} />;
}

export default Page;
