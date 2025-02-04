import { useEffect, useMemo } from 'react';

import { SongForm } from '@web/src/modules/song/components/client/SongForm';

import { useUploadSongProviderType } from './context/UploadSong.context';
import { useSongProvider } from '../../../song/components/client/context/Song.context';

const type = 'upload';

export const SongUploadForm = ({
  defaultAuthorName,
}: {
  defaultAuthorName: string;
}) => {
  const { formMethods, song, isSubmitting } = useSongProvider(
    type,
  ) as useUploadSongProviderType;

  const defaultAuthorNameMemo = useMemo(() => {
    return defaultAuthorName;
  }, [defaultAuthorName]);

  useEffect(() => {
    formMethods.setValue('author', defaultAuthorNameMemo);
  }, [defaultAuthorName, defaultAuthorNameMemo, formMethods]);

  return <SongForm type={type} isLocked={!song || isSubmitting} />;
};
