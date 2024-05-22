import { useEffect } from 'react';

import { useUploadSongProviderType } from './context/UploadSong.context';
import { SongForm } from './SongForm';
import { useSongProvider } from '../../../song/components/client/context/Song.context';

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
