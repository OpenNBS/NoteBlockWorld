'use client';

import { UploadSongDtoType } from '@nbw/database';
import { useEffect } from 'react';

import { useSongProvider } from '@web/modules/song/components/client/context/Song.context';
import { SongForm } from '@web/modules/song/components/client/SongForm';

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

  return <SongForm type={type} isLoading={!song} isLocked={isSubmitting} />;
};
