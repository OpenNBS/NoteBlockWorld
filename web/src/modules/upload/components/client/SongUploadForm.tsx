import { useEffect, useMemo } from 'react';

import { SongForm } from '@web/src/modules/song/components/client/SongForm';

import { useUploadSongProviderType } from './context/UploadSong.context';
import { useSongProvider } from '../../../song/components/client/context/Song.context';

export const SongUploadForm = ({
  defaultAuthorName,
}: {
  defaultAuthorName: string;
}) => {
  const type = 'upload';
  const { formMethods } = useSongProvider(type) as useUploadSongProviderType;

  const defaultAuthorNameMemo = useMemo(() => {
    return defaultAuthorName;
  }, [defaultAuthorName]);

  useEffect(() => {
    formMethods.setValue('artist', defaultAuthorNameMemo);
  }, [defaultAuthorName, defaultAuthorNameMemo, formMethods]);

  return <SongForm type={type} />;
};
