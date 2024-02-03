'use client';

import {
  faDownload,
  faPencil,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';

const DownloadButton = ({ songId }: { songId: string }) => {
  return (
    <button
      onClick={() => {
        console.log(`Download song with id: ${songId}`);
      }}
      className='flex items-center justify-center w-5 h-5 hover:text-green-500 hover:scale-[1.25] transition-all duration-150'
    >
      <FontAwesomeIcon icon={faDownload} className='w-full h-full' />
    </button>
  );
};

const EditButton = ({ songId }: { songId: string }) => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        console.log(`Edit song with id: ${songId}`);
        router.push(`/songs/${songId}/edit/`);
      }}
      className='flex items-center justify-center w-5 h-5 hover:text-blue-500 hover:scale-[1.25] transition-all duration-150'
    >
      <FontAwesomeIcon icon={faPencil} className='w-full h-full' />
    </button>
  );
};

const DeleteButton = ({ songId }: { songId: string }) => {
  return (
    <button
      onClick={() => {
        console.log(`Delete song with id: ${songId}`);
      }}
      className='flex items-center justify-center w-5 h-5 hover:text-red-500 hover:scale-[1.25] transition-all duration-150'
    >
      <FontAwesomeIcon icon={faTrash} className='w-full h-full' />
    </button>
  );
};

export { DownloadButton, EditButton, DeleteButton };
