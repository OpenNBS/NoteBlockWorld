import { useEffect } from 'react';

import { useSongProvider } from './context/Song.context';
import { useUploadSongProviderType } from './context/UploadSong.context';
import { SongForm } from './SongForm';

export const SongUploadForm = ({
  defaultAuthorName,
}: {
  defaultAuthorName: string;
}) => {
  const type = 'upload';
  const { formMethods } = useSongProvider(type) as useUploadSongProviderType;

  useEffect(() => {
    formMethods.setValue('artist', defaultAuthorName);
  }, [defaultAuthorName]);

  return <SongForm type={type} />;
};
