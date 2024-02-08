'use client';
import { useEffect } from 'react';
import { SongsPage } from '../../types';
import { useMySongsProvider } from '../client/MySongs.context';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';
import { SongRow } from './SongRow';

const LoadingRows = () => (
  <>
    {Array.from({ length: 10 }).map((_, i) => (
      <TableRow key={i}>
        <TableCell colSpan={6}>Loading...</TableCell>
      </TableRow>
    ))}
  </>
);

const EmptyRow = () => (
  <TableRow>
    <TableCell colSpan={6}>No songs found.</TableCell>
  </TableRow>
);

const SongRows = ({ page }: { page: SongsPage }) => {
  const { content } = page;
  return (
    <>
      {content.map((song) => (
        <SongRow key={song.id} song={song} />
      ))}
    </>
  );
};

export const MySongsTable = () => {
  const {
    page,
    nextpage,
    prevpage,
    gotoPage,
    totalPages,
    currentPage,
    isLoading,
    error,
  } = useMySongsProvider();
  useEffect(() => {
    console.log('page', page);
  }, [page]);

  return (
    <section className='flex flex-col h-full gap-12 justify-between w-full transition-all'>
      <h1 className='text-3xl font-semibold flex-1 pt-8'>My songs</h1>
      {error && (
        <div className='bg-red-500 text-white p-4 rounded-lg'>{error}</div>
      )}
      <Table className='w-[90vw] text-md text-center h-full text-nowrap text-ellipsis border-separate border-spacing-0'>
        <TableHeader className='sticky top-14 z-10'>
          <TableRow className=''>
            <TableHead colSpan={2}>Song</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Play count</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className=''>
          {isLoading && <LoadingRows />}
          {!isLoading && !page && <EmptyRow />}
          {!isLoading && page && <SongRows page={page} />}
        </TableBody>
        <TableFooter className='sticky bottom-0'>
          <TableRow>
            <TableHead colSpan={4}>
              <div className='flex items-center justify-center gap-4 h-12'>
                <button
                  onClick={prevpage}
                  className='disabled:opacity-50 disabled:cursor-not-allowed'
                  disabled={currentPage === 0}
                >
                  Previous
                </button>
                <button
                  onClick={nextpage}
                  className='disabled:opacity-50 disabled:cursor-not-allowed'
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </TableHead>
            <TableHead colSpan={2}>
              <div className='flex items-center justify-center gap-4 h-12'>
                <label htmlFor='page' className='text-zinc-400'>
                  Page
                </label>
                <input
                  type='number'
                  value={currentPage}
                  onChange={(e) => gotoPage(Number(e.target.value))}
                  className={`block w-8 rounded-lg bg-transparent border-2 border-zinc-500 disabled:border-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500 `}
                />
                <span className='text-zinc-400'>{`of ${totalPages}`}</span>
              </div>
            </TableHead>
          </TableRow>
        </TableFooter>
      </Table>
    </section>
  );
};
