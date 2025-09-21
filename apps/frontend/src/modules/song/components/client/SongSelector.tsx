import { faFile, faMusic } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UPLOAD_CONSTANTS } from '@nbw/config';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';

import { useSongProvider } from './context/Song.context';

export const SongSelector = () => {
  const { setFile } = useSongProvider('upload');

  const handleFileDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles) return;
      const file = acceptedFiles[0];
      setFile(file);
    },
    [setFile],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: handleFileDrop,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0].errors[0].code;

      if (error === 'file-invalid-type') {
        toast.error("Oops! This doesn't look like a valid NBS file.", {
          position: 'bottom-center',
        });
      } else if (error === 'file-too-large') {
        toast.error('This file is too large! (Max size: 3 MB)', {
          position: 'bottom-center',
        });
      }
    },
    accept: {
      'application/nbs': ['.nbs'],
    },
    maxSize: UPLOAD_CONSTANTS.file.maxSize,
    multiple: false,
    noClick: true,
  });

  return (
    <>
      <div
        className={`flex flex-col items-center gap-6 h-fit p-8 mb-4 border-dashed border-4 ${
          isDragActive ? 'border-blue-400' : 'border-zinc-700'
        } transition-all duration-250 ease-in-out`}
        {...getRootProps()}
      >
        <FontAwesomeIcon
          icon={faFile}
          className={`${
            isDragActive ? 'text-blue-400 scale-105' : 'text-zinc-600'
          } transition-all duration-250 ease-in-out !h-20`}
        />

        <FontAwesomeIcon
          icon={faMusic}
          className={`absolute translate-y-9 !h-8 !w-8 text-zinc-900 ${
            isDragActive ? 'scale-105' : ''
          } transition-all duration-250 ease-in-out`}
        />

        <div className='text-center'>
          <p className='font-semibold text-xl'>Drag and drop your song</p>
          <p className='text-zinc-400'>or select a file below</p>
        </div>
        <label
          htmlFor='uploadNbsFile'
          onClick={open}
          className='px-3 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white cursor-pointer'
        >
          Select file
        </label>
        <input {...getInputProps()} />
      </div>
    </>
  );
};
