// import { useMySongsProvider } from './MySongs.context';
import { use, useMemo } from 'react';
import { MySongsSongDTO } from './MySongs.context';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DeleteButton, EditButton } from './MySongsButtons';
import { faEye, faEyeSlash, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SongRow = ({ song }: { song: MySongsSongDTO }) => {
  return (
    <TableRow key={song.id}>
      {/* Song */}
      <TableCell>
        <div className='flex flex-row gap-4 items-center'>
          <div className='w-56 my-1.5 object-cover rounded-lg relative'>
            <img
              src='/demo.png'
              className='w-full h-full object-cover rounded-lg'
            />
            <div className='absolute bottom-0 right-0 m-1.5 px-1 py-0.5 bg-zinc-900/80 rounded-md'>
              <span className='text-white font-semibold text-md'>
                {song.duration}
              </span>
            </div>
          </div>
          <div className='flex flex-col justify-center gap-1 text-left max-w-96'>
            <div className='line-clamp-2 text-ellipsis text-md font-medium leading-tight'>
              {song.title}
            </div>
            <p className='line-clamp-3 text-ellipsis text-sm leading-tight text-zinc-400'>
              {song.description}
            </p>
          </div>
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
        <div className='flex flex-row justify-center gap-2 text-xl'>
          <EditButton songId={song.id} />
          <DeleteButton songId={song.id} />
        </div>
      </TableCell>
    </TableRow>
  );
};

const MySongsPage = ({ userSongs }: { userSongs: MySongsSongDTO[] }) => {
  // const { isLogged, userData, userSongs } = useMySongsProvider();

  userSongs = [
    {
      id: '1',
      thumbnail: 'thumbnail',
      title:
        "This is a very long title - By an even longer author name that almost doesn't even fit in the cell",
      description:
        'This is a short description of the song. It contains a bit of text to show how it looks like.',
      visibility: 'public',
      createdAt: '2021-10-10 10:32',
      playCount: 0,
      duration: '3:08',
    },
    {
      id: '2',
      thumbnail: 'thumbnail',
      title: 'title',
      description:
        'This is a short description of the song. It contains a bit of text to show how it looks like. This one contains some more text to show that it will exceed the width of the cell and will be truncated with an ellipsis.',
      visibility: 'private',
      createdAt: '2021-10-10 10:32',
      playCount: 332,
      duration: '2:57',
    },
    {
      id: '3',
      thumbnail: 'thumbnail',
      title: 'title',
      description:
        'This is a short description of the song. It contains a bit of text to show how it looks like.',
      visibility: 'public',
      createdAt: '2021-10-10 10:32',
      playCount: 84,
      duration: '1:06',
    },
  ];

  return (
    <>
      <h1 className='text-3xl font-semibold uppercase'>My songs</h1>
      <div className='h-10'></div>
      <Table className='table-auto min-w-[600px] text-md text-center'>
        <TableHeader className='bg-zinc-700 rounded-lg'>
          <TableRow className='rounded-lg'>
            <TableHead>Song</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Play count</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userSongs.map((song) => (
            <SongRow key={song.id} song={song} />
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default MySongsPage;
