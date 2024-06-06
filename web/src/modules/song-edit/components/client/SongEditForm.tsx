'use client';

import { UploadSongDtoType } from '@shared/validation/song/dto/types';
import { useEffect } from 'react';

import { useSongProvider } from '@web/src/modules/song/components/client/context/Song.context';
import { SongForm } from '@web/src/modules/song/components/client/SongForm';
import { downloadSongFile } from '@web/src/modules/song/util/downloadSong';

import { useEditSongProviderType } from './context/EditSong.context';

type SongEditFormProps = {
  songData: UploadSongDtoType;
  songId: string;
  username: string;
};

export const SongEditForm = ({
  songData,
  songId,
  username,
}: SongEditFormProps) => {
  const type = 'edit';

  const { loadSong, setSongId, song, isSubmitting } = useSongProvider(
    type,
  ) as useEditSongProviderType;

  useEffect(() => {
    loadSong(songId, username, songData);
    setSongId(songId);
  }, [loadSong, setSongId, songData, songId, username]);
  // TODO: The username is injected into the form differently in SongUploadForm (defaultAuthorName) and SongEditForm (username). This should be consistent

  return (
    <>
      <p className='text-m text-gray-500 text-right my-5'>
        Song file:{' '}
        <button
          className='text-blue-500 underline pointer'
          onClick={() =>
            downloadSongFile({
              publicId: songId,
              title: `${songData.originalAuthor || username} - ${
                songData.title
              }`,
            })
          }
        >
          {songData.originalAuthor || username} - {songData.title}.nbs
        </button>
      </p>
      <SongForm type={type} isLoading={!song} isLocked={isSubmitting} />
    </>
  );
};
