'use client';

import { useEffect } from 'react';

import { useSongProvider } from '@web/src/modules/song/components/client/context/Song.context';
import { SongForm } from '@web/src/modules/upload/components/client/SongForm';

import { useEditSongProviderType } from './context/EditSong.context';

export const SongEditForm = ({ songData }: { songData: any }) => {
  const type = 'edit';
  const { formMethods } = useSongProvider(type) as useEditSongProviderType;
  useEffect(() => {
    console.log('songData', songData);
  }, [songData]);
  return <SongForm type={type} />;
};
