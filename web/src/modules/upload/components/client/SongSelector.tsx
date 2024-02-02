import { faFileAudio } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadSongProvider } from './UploadSong.context';
import { ErrorBallon } from '../../../shared/components/client/ErrorBallon';
export const SongSelector = () => {
  const { setFile, invalidFile } = useUploadSongProvider();

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const file = e.target.files[0];
      setFile(file);
    },
    [setFile]
  );

  const handleFileDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles) return;
      const file = acceptedFiles[0];
      setFile(file);
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileDrop,
    accept: {
      'application/octet-stream': ['.nbs'],
    },
    multiple: false,
    noClick: true,
  });

  return (
    <>
      <ErrorBallon message='Invalid File' isVisible={invalidFile} />
      <div
        className={`flex flex-col items-center gap-6 h-fit p-8 mb-4 border-dashed border-4 ${
          isDragActive ? 'border-blue-400' : 'border-zinc-700'
        } transition-all duration-250 ease-in-out`}
        {...getRootProps()}
      >
        <FontAwesomeIcon
          icon={faFileAudio}
          className={`${
            isDragActive ? 'text-blue-400 scale-105' : 'text-zinc-600'
          } transition-all duration-250 ease-in-out h-20`}
        />

        <div className='text-center'>
          <p className='font-semibold text-xl'>Drag and drop your song</p>
          <p className='text-zinc-400'>or select a file below</p>
        </div>
        <label
          htmlFor='uploadNbsFile'
          className='px-3 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white cursor-pointer'
        >
          Select file
        </label>
        <input
          type='file'
          name='nbsFile'
          id='uploadNbsFile'
          accept='.nbs'
          className='z-[-1] absolute opacity-0'
          onChange={handleFileSelect}
          {...getInputProps()}
        />
      </div>
    </>
  );
};
