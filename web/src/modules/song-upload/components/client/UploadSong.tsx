'use client';

import {
  ChangeFileButton,
  FileDisplay,
} from '@web/src/modules/song/components/client/FileDisplay';

import { SongUploadForm } from './SongUploadForm';
import {
  SongProvider,
  useSongProvider,
} from '../../../song/components/client/context/Song.context';
import { SongSelector } from '../../../song/components/client/SongSelector';

const UploadSong = ({ defaultAuthorName }: { defaultAuthorName: string }) => {
  const { song, filename } = useSongProvider('upload');

  return (
    <>
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
    </>
  );
};

export const UploadSongPage = ({
  defaultAuthorName,
}: {
  defaultAuthorName: string;
}) => {
  return (
    <SongProvider>
      <UploadSong defaultAuthorName={defaultAuthorName} />
    </SongProvider>
  );
};
