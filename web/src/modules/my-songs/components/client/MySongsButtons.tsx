'use client';

import {
  faDownload,
  faPencil,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DownloadButton = ({ songId }: { songId: string }) => {
  return (
    <button
      onClick={() => {
        console.log(`Download song with id: ${songId}`);
      }}
    >
      <FontAwesomeIcon icon={faDownload} />
    </button>
  );
};

const EditButton = ({ songId }: { songId: string }) => {
  return (
    <button
      onClick={() => {
        console.log(`Edit song with id: ${songId}`);
      }}
    >
      <FontAwesomeIcon
        icon={faPencil}
        className='hover:text-blue-500 transition-all duration-150'
      />
    </button>
  );
};

const DeleteButton = ({ songId }: { songId: string }) => {
  return (
    <button
      onClick={() => {
        console.log(`Delete song with id: ${songId}`);
      }}
    >
      <FontAwesomeIcon icon={faTrash} />
    </button>
  );
};

export { EditButton, DeleteButton };
