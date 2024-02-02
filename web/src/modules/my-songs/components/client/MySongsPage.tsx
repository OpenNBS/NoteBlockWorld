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
import { DeleteButton, DownloadButton, EditButton } from './MySongsButtons';
import {
  faCirclePlay,
  faEye,
  faEyeSlash,
  faPlay,
  faPlayCircle,
} from '@fortawesome/free-solid-svg-icons';
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
            <div className='flex items-center justify-center absolute bottom-0 right-0 top-0 left-0 rounded-lg bg-black opacity-0 hover:opacity-40 cursor-pointer transition-all duration-200'>
              <FontAwesomeIcon
                icon={faCirclePlay}
                className='text-white w-12 h-12'
              />
            </div>
          </div>
          <div className='flex flex-col justify-center gap-1 text-left max-w-96'>
            <span className='line-clamp-2 text-ellipsis text-md font-medium leading-tight hover:underline cursor-pointer'>
              {song.title}
            </span>
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
