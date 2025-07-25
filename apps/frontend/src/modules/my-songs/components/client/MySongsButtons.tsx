'use client';

import {
  faDownload,
  faPencil,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@web/src/modules/shared/components/tooltip';
import { downloadSongFile } from '@web/src/modules/song/util/downloadSong';

export const DownloadSongButton = ({
  song,
}: {
  song: {
    publicId: string;
    title: string;
  };
}) => {
  return (
    <DownloadButton
      handleClick={async () => {
        downloadSongFile(song);
      }}
    />
  );
};

const DownloadButton = ({
  handleClick,
}: {
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleClick}
          className='flex items-center justify-center w-8 h-8 hover:text-green-500 hover:scale-[1.25] transition-all duration-150'
        >
          <FontAwesomeIcon icon={faDownload} />
        </button>
      </TooltipTrigger>
      <TooltipContent>Download</TooltipContent>
    </Tooltip>
  );
};

const EditButton = ({ songId }: { songId: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={`/song/${songId}/edit`}
          className='flex items-center justify-center w-8 h-8 hover:text-blue-500 hover:scale-[1.25] transition-all duration-150'
        >
          <FontAwesomeIcon icon={faPencil} />
        </Link>
      </TooltipTrigger>
      <TooltipContent>Edit</TooltipContent>
    </Tooltip>
  );
};

const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className='flex items-center justify-center w-8 h-8 hover:text-red-500 hover:scale-[1.25] transition-all duration-150'
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </TooltipTrigger>
      <TooltipContent className='text-red-500'>Delete</TooltipContent>
    </Tooltip>
  );
};

export { DownloadButton, EditButton, DeleteButton };
