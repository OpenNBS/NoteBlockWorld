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
  const { loadSong, setSongId } = useSongProvider(
    type,
  ) as useEditSongProviderType;
  useEffect(() => {
    loadSong(songId, username, songData);
    setSongId(songId);
  }, [loadSong, setSongId, songData, songId, username]);
  return <SongForm type={type} />;
};
