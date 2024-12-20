'use client';

import { faDice } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SongPreviewDto } from '@shared/validation/song/dto/SongPreview.dto';
import { useRouter } from 'next/navigation';

import axios from '@web/src/lib/axios';

export const RandomSongButton = () => {
  const router = useRouter();

  const randomSong = async () => {
    let songId;

    try {
      const response = await axios.get<SongPreviewDto[]>(
        '/song-browser/random',
        {
          params: {
            count: 1,
          },
        },
      );

      songId = response.data[0].publicId;
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
      className='bevel p-2 flex-0 w-8 w-min flex items-center justify-center gap-2 bg-zinc-600 after:bg-zinc-800 before:bg-zinc-900 translate-y-[11px] hover:translate-y-1.5 transition-all duration-150 hover:brightness-125'
      onClick={randomSong}
    >
      <FontAwesomeIcon icon={faDice} />
    </button>
  );
};
