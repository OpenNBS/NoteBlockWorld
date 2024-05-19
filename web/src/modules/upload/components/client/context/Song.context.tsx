'use client';

import { useContext } from 'react';

import {
  EditSongContext,
  EditSongProvider,
  useEditSongProviderType,
} from './EditSong.context';
import {
  UploadSongContext,
  UploadSongProvider,
  useUploadSongProviderType,
} from './UploadSong.context';

export const SongProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <UploadSongProvider>
      <EditSongProvider>{children}</EditSongProvider>
    </UploadSongProvider>
  );
};

type ContextType = 'upload' | 'edit';
export const useSongProvider = <T extends ContextType>(type: T) => {
  const uploadContext = useContext(UploadSongContext);
  const editContext = useContext(EditSongContext);
  if (type === 'upload') {
    return uploadContext as T extends 'upload'
      ? useUploadSongProviderType
      : useEditSongProviderType;
  } else {
    return editContext as T extends 'upload'
      ? useUploadSongProviderType
      : useEditSongProviderType;
  }
};
