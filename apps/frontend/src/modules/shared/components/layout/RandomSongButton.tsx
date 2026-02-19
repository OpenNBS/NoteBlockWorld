'use client';

import { faDice } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';

import type { PageDto, SongPreviewDto } from '@nbw/database';
import axios from '@web/lib/axios';

import { MusicalNote } from './MusicalNote';

export const RandomSongButton = () => {
  const router = useRouter();

  const randomSong = async () => {
    let songId;

    try {
      const response = await axios.get<PageDto<SongPreviewDto>>('/song', {
        params: {
          sort: 'random',
          limit: 1,
        },
      });
      songId = response.data.content[0].publicId;
    } catch {
      console.error('Failed to retrieve a random song');
      return;
    }

    // client-side redirect
    if (songId) {
      router.push(`/song/${songId}`);
    }
  };

  return (
    <button
      className='bevel flex-0 min-w-8 flex items-center justify-center gap-2 bg-zinc-500 after:bg-zinc-700 before:bg-zinc-800 translate-y-[11px] hover:translate-y-1.5 transition-all duration-150 hover:brightness-125'
      onClick={randomSong}
    >
      <FontAwesomeIcon icon={faDice} />
      <MusicalNote />
    </button>
  );
};
