import {
  faCirclePlay,
  faEye,
  faEyeSlash,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MySongsSongDTO } from '../../types';
import {
  DeleteButton,
  DownloadButton,
  EditButton,
} from '../client/MySongsButtons';
import { TableCell, TableRow } from '../table';

export const SongRow = ({ song }: { song: MySongsSongDTO }) => {
  return (
    <TableRow key={song.id}>
      {/* Thumbnail */}
      <TableCell>
        <div className='aspect-video my-1.5 min-w-20 max-h-28 object-cover rounded-lg relative'>
          <img
            src='/demo.png'
            className='w-full h-full object-cover rounded-lg'
          />
          <div className='absolute bottom-0 right-0 m-1.5 px-1 py-0.5 bg-zinc-900/80 rounded-md'>
            <span className='text-white font-semibold text-md'>
              {song.duration}
            </span>
          </div>
          <div className='flex items-center justify-center absolute bottom-0 right-0 top-0 left-0 rounded-lg bg-black opacity-0 hover:opacity-40 cursor-pointer transition-all duration-200'>
            <FontAwesomeIcon
              icon={faCirclePlay}
              className='text-white w-12 h-12'
            />
          </div>
        </div>
      </TableCell>

      {/* Song */}
      <TableCell className='text-wrap'>
        <div className='flex flex-col justify-center gap-1 text-left max-w-96'>
          <span className='line-clamp-2 text-ellipsis text-md font-medium leading-tight hover:underline cursor-pointer'>
            {song.title}
          </span>
          <p
            className={`line-clamp-3 text-ellipsis text-sm leading-tight text-zinc-400 ${
              !song.description && 'italic'
            }`}
          >
            {song.description || 'No description'}
          </p>
        </div>
      </TableCell>

      {/* Visibility */}
      <TableCell>
        <div className='flex flex-col items-center gap-1'>
          <FontAwesomeIcon
            icon={song.visibility === 'private' ? faEyeSlash : faEye}
            className='text-lg w-6'
          />
          <span>
            {song.visibility.charAt(0).toUpperCase() + song.visibility.slice(1)}
          </span>
        </div>
      </TableCell>

      {/* Created at */}
      <TableCell>
        {new Date(song.createdAt).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </TableCell>

      {/* Play count */}
      <TableCell>
        <div className='flex flex-row items-center justify-center gap-1.5'>
          <FontAwesomeIcon icon={faPlay} className='text-sm w-2.5' />
          <span className='text-lg font-bold'>{song.playCount}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className='flex flex-col items-center justify-center gap-3 text-xl'>
          {/* TODO: add popups/tooltips */}
          <DownloadButton songId={song.id} />
          <EditButton songId={song.id} />
          <DeleteButton songId={song.id} />
        </div>
      </TableCell>
    </TableRow>
  );
};
