'use client';

import {
  ChangeFileButton,
  FileDisplay,
} from '@web/modules/song/components/client/FileDisplay';

import {
  SongProvider,
  useSongProvider,
} from '../../../song/components/client/context/Song.context';
import { SongSelector } from '../../../song/components/client/SongSelector';

import { SongUploadForm } from './SongUploadForm';

const UploadSongPageComponent = ({
  defaultAuthorName,
}: {
  defaultAuthorName: string;
}) => {
  const { song, filename } = useSongProvider('upload');

  return (
    <div className='p-8 h-full w-full flex justify-center'>
      <div className='w-[75vw] max-w-[768px]'>
        <div className='flex flex-row justify-between items-center gap-12 mb-10'>
          <h1 className='flex-1 text-3xl font-semibold text-nowrap'>
            Upload song
          </h1>
          {filename && (
            <FileDisplay fileName={filename}>
              <ChangeFileButton
                handleClick={() => {
                  window.location.reload();
                }}
              />
            </FileDisplay>
          )}
        </div>
        {!song ? (
          <SongSelector />
        ) : (
          <SongUploadForm defaultAuthorName={defaultAuthorName} />
        )}
      </div>
    </div>
  );
};

export const UploadSongPage = ({
  defaultAuthorName,
}: {
  defaultAuthorName: string;
}) => {
  return (
    <SongProvider>
      <UploadSongPageComponent defaultAuthorName={defaultAuthorName} />
    </SongProvider>
  );
};
