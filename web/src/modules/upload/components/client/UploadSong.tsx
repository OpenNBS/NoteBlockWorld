'use client';

import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { SongSelector } from './SongSelector';
import { SongUploadForm } from './SongUploadForm';
import UploadCompleteModal from './UploadCompleteModal';
import {
  UploadSongProvider,
  useUploadSongProvider,
} from './UploadSong.context';

const UploadSong = ({ defaultAuthorName }: { defaultAuthorName: string }) => {
  const { song, filename, isUploadComplete, uploadedSongId } =
    useUploadSongProvider();

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

      {uploadedSongId && (
        <UploadCompleteModal
          isOpen={isUploadComplete}
          songId={uploadedSongId}
        />
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
    <UploadSongProvider>
      <UploadSong defaultAuthorName={defaultAuthorName} />
    </UploadSongProvider>
  );
};
