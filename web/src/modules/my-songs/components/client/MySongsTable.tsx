'use client';

import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DeleteConfirmDialog from './DeleteConfirmDialog';
import { SongRow } from './SongRow';
import { SongsPage } from '../../types';
import { useMySongsProvider } from '../client/MySongs.context';

const Loading = () => <p>Loading...</p>; // TODO: replace with loading skeleton

const NoSongs = () => <p>{"You haven't uploaded any song yet!"}</p>;

const SongRows = ({ page }: { page: SongsPage }) => {
  const { content } = page;
  return content.map((song) => <SongRow key={song.publicId} song={song} />);
};

const MySongsTablePaginator = () => {
  const { nextpage, prevpage, totalSongs, totalPages, currentPage, pageSize } =
    useMySongsProvider();

  const start = currentPage * pageSize - pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalSongs);
  const total = totalSongs;

  return (
    <div className='flex items-center justify-center gap-6 h-12'>
      <button
        onClick={prevpage}
        className='disabled:opacity-50 disabled:cursor-not-allowed'
        disabled={currentPage === 1}
        aria-label='Previous page'
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <span className='min-w-24'>
        {start} – {end} of {total}
      </span>
      <button
        onClick={nextpage}
        className='disabled:opacity-50 disabled:cursor-not-allowed'
        disabled={currentPage === totalPages}
        aria-label='Next page'
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export const MySongsTable = () => {
  const { page } = useMySongsProvider();

  return (
    <div className='min-w-full h-full text-md text-center text-nowrap text-ellipsis border-separate border-spacing-0'>
      {/* Header */}
      <div className='grid grid-cols-8 sticky top-14 z-10 bg-zinc-800 border-2 border-zinc-700 rounded-t-lg py-2'>
        <div className='col-span-4'>Song</div>
        <div>Visibility</div>
        <div>Created at</div>
        <div>Play count</div>
        <div>Actions</div>
      </div>

      {/* Content */}
      {page && <SongRows page={page} />}

      {/* Footer (pagination) */}
      <div className='sticky bottom-0 border-2 bg-zinc-800 border-zinc-700 rounded-b-lg'>
        <MySongsTablePaginator />
      </div>
    </div>
  );
};

export const MySongsPageComponent = () => {
  const {
    error,
    page,
    isLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    songToDelete,
    deleteSong,
  } = useMySongsProvider();

  return (
    <>
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        songId={songToDelete?.publicId || ''}
        songTitle={songToDelete?.title || ''}
        onConfirm={deleteSong}
      />
      <section className='flex flex-col h-full gap-12 justify-between w-full transition-all'>
        <h1 className='text-3xl font-semibold flex-1 pt-8'>My songs</h1>
        {error && (
          <div className='bg-red-500 text-white p-4 rounded-lg'>{error}</div>
        )}
        <div className='flex flex-col gap-12 w-full'>
          {isLoading ? <Loading /> : page ? <MySongsTable /> : <NoSongs />}
        </div>
      </section>
    </>
  );
};
