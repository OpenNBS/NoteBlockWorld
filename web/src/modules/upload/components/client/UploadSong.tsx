'use client';

import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
      <div className='flex flex-row justify-between items-center gap-12'>
        <div className='flex-1'>
          <h1 className='text-3xl font-semibold text-nowrap'>Upload song</h1>
        </div>
        {song && (
          <div className='flex-shrink min-w-0 flex flex-row gap-4 items-center text-zinc-500'>
            <div className='flex-shrink min-w-0 max-w-96 flex flex-row gap-2 items-center'>
              <FontAwesomeIcon icon={faFile} size='lg' />
              <p className='text-md flex-shrink min-w-0 truncate'>{filename}</p>
            </div>
            <button
              className='text-nowrap px-3 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white'
              onClick={() => {
                window.location.reload();
              }}
            >
              Change file
            </button>
          </div>
        )}
      </div>
      <div className='h-10' />
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
