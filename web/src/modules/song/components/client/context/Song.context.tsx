'use client';

import { useContext } from 'react';

import {
  EditSongContext,
  EditSongProvider,
  useEditSongProviderType,
} from '../../../../song-edit/components/client/context/EditSong.context';
import {
  UploadSongContext,
  UploadSongProvider,
  useUploadSongProviderType,
} from '../../../../song-upload/components/client/context/UploadSong.context';

export const SongProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <UploadSongProvider>
      <EditSongProvider>{children}</EditSongProvider>
    </UploadSongProvider>
  );
};

type ContextType = 'upload' | 'edit';

export const useSongProvider = (
  type: ContextType,
): useUploadSongProviderType & useEditSongProviderType => {
  const uploadContext = useContext(UploadSongContext);
  const editContext = useContext(EditSongContext);
  const currentContext = type === 'upload' ? uploadContext : editContext;

  return currentContext as useUploadSongProviderType & useEditSongProviderType;
};
