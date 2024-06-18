'use client';

import { faDownload, faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { cn } from '@web/src/lib/tailwind.utils';

import { downloadSongFile } from '../../util/downloadSong';

export const FileDisplay = ({
  fileName,
  children,
  className,
}: {
  fileName: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn('flex flex-row gap-4 items-center text-zinc-500', className)}
  >
    <div className='flex-shrink min-w-0 max-w-96 flex flex-row gap-2 items-center'>
      <FontAwesomeIcon icon={faFile} size='lg' />
      <p className='text-md flex-shrink min-w-0 truncate'>{fileName}</p>
    </div>
    {children}
  </div>
);

export const ChangeFileButton = ({
  handleClick,
}: {
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
}) => (
  <button
    onClick={handleClick}
    className='text-nowrap px-3 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-white'
  >
    Change file
  </button>
);

export const DownloadFileButton = ({
  song,
}: {
  song: {
    publicId: string;
    title: string;
  };
}) => {
  return (
    <button
      className='text-nowrap px-2 py-1 bg-green-600 hover:bg-green-500 rounded-lg text-white'
      onClick={async () => downloadSongFile(song)}
    >
      <FontAwesomeIcon icon={faDownload} />
    </button>
  );
};
