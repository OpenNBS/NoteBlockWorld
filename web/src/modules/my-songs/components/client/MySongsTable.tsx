'use client';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MY_SONGS } from '@shared/validation/song/constants';
import { SongPageDtoType } from '@shared/validation/song/dto/types';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';

import { useMySongsProvider } from './context/MySongs.context';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { SongRow } from './SongRow';

const NoSongs = () => (
  <div className='flex-col items-center justify-center border-2 border-zinc-700 rounded-lg p-5'>
    <div className='flex items-center justify-center'>
      <Image
        src='/emptyChest.gif'
        alt='Note Block World logo'
        className='w-[100px] sm:w-[128px]'
        width={150}
        height={150}
        style={{
          filter: 'contrast(1) brightness(1.5) grayscale(.8)',
        }}
      />
    </div>
    <div className='flex items-center justify-center'>
      <p>
        {/* // eslint-disable-next-line react/no-unescaped-entities */}
        {" You haven't uploaded any songs yet. Click the"}
        <a href='/upload' className='text-blue-500 underline px-1'>
          {'Upload'}
        </a>
        {'button to get started!'}
      </p>
    </div>
  </div>
);
const SongRows = ({
  page,
  pageSize,
}: {
  page: SongPageDtoType | null;
  pageSize: number;
}) => {
  const maxPage = MY_SONGS.PAGE_SIZE;
  const content = !page ? Array(pageSize).fill(null) : page.content;
  return (
    <>
      {content.map((song, i) => (
        <SongRow key={i} song={song} />
      ))}
      {maxPage - content.length > 0 &&
        Array(maxPage - content.length)
          .fill(null)
          .map((_, i) => <SongRow key={i} song={null} />)}
    </>
  );
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
      <div className='w-24'>
        {total === 0 ? (
          <Skeleton />
        ) : (
          <>
            {start} – {end} of {total}
          </>
        )}
      </div>
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
  const { page, pageSize, isLoading } = useMySongsProvider();

  return (
    <div className='min-w-full h-full text-md text-center text-nowrap text-ellipsis border-separate border-spacing-0'>
      {/* Header */}
      {page?.content.length !== 0 && (
        <div className='grid grid-cols-8 sticky top-14 z-10 bg-zinc-800 border-2 border-zinc-700 rounded-t-lg py-2'>
          <div className='col-span-4'>Song</div>
          <div>Visibility</div>
          <div>Created at</div>
          <div>Play count</div>
          <div>Actions</div>
        </div>
      )}
      {page?.content.length === 0 ? (
        <NoSongs />
      ) : (
        <SongRows page={page} pageSize={pageSize} />
      )}
      {/* Footer (pagination) */}
      {page?.content.length !== 0 && (
        <div className='sticky bottom-0 border-2 bg-zinc-800 border-zinc-700 rounded-b-lg'>
          <MySongsTablePaginator />
        </div>
      )}
    </div>
  );
};

export const MySongsPageComponent = () => {
  const {
    error,
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
          <MySongsTable />
        </div>
      </section>
    </>
  );
};
