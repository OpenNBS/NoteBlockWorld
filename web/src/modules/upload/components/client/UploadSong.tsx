'use client';

import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  UploadSongProvider,
  useUploadSongProvider,
} from './UploadSong.context';
import { SongSelector } from './SongSelector';
import { SongUploadForm } from './SongUploadForm';

const UploadSong = () => {
  const { song, filename } = useUploadSongProvider();
  return (
    <>
      <div className='flex flex-row flex-wrap justify-between items-center gap-8'>
        <div>
          <h1 className='text-3xl font-semibold'>Upload song</h1>
        </div>
        {song && (
          <div className='flex flex-row gap-4 items-center text-zinc-500'>
            <div className='flex flex-row gap-2 items-center'>
              <FontAwesomeIcon icon={faFile} size='lg' />
              <p className='text-md'>{filename}</p>
            </div>
            <button
              className='px-3 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white'
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
      {!song ? <SongSelector /> : <SongUploadForm />}
    </>
  );
};

export const UploadSongPage = () => {
  return (
    <UploadSongProvider>
      <UploadSong />
    </UploadSongProvider>
  );
};
