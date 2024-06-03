'use client';

import { UploadSongDtoType } from '@nbw/validation/song/dto/types';
import { useEffect } from 'react';

import { useSongProvider } from '@web/src/modules/song/components/client/context/Song.context';
import { SongForm } from '@web/src/modules/song/components/client/SongForm';

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

  const { loadSong, setSongId, song, formMethods, isSubmitting } =
    useSongProvider(type) as useEditSongProviderType;

  useEffect(() => {
    loadSong(songId, username, songData);
    setSongId(songId);
  }, [loadSong, setSongId, songData, songId, username]);
  // TODO: The username is injected into the form differently in SongUploadForm (defaultAuthorName) and SongEditForm (username). This should be consistent

  return (
    <>
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={() => {
          console.log(formMethods.getValues());
        }}
      >
        test
      </button>
      <SongForm type={type} isLocked={!song || isSubmitting} />
    </>
  );
};
