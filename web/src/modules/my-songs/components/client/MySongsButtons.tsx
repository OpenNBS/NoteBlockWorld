'use client';

import {
  faDownload,
  faPencil,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

const DownloadButton = ({ songId }: { songId: string }) => {
  return (
    <Link
      href={`/song/${songId}/download`}
      className='flex items-center justify-center w-8 h-8 hover:text-green-500 hover:scale-[1.25] transition-all duration-150'
    >
      <FontAwesomeIcon icon={faDownload} />
    </Link>
  );
};

const EditButton = ({ songId }: { songId: string }) => {
  return (
    <Link
      href={`/song/${songId}/edit`}
      className='flex items-center justify-center w-8 h-8 hover:text-blue-500 hover:scale-[1.25] transition-all duration-150'
    >
      <FontAwesomeIcon icon={faPencil} />
    </Link>
  );
};

const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className='flex items-center justify-center w-8 h-8 hover:text-red-500 hover:scale-[1.25] transition-all duration-150'
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
  );
};

export { DownloadButton, EditButton, DeleteButton };
