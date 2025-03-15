'use client';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserSearchViewDto } from '@shared/validation/user/dto/UserSearchView.dto';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useSearch } from './client/context/useSearch';

type UserCardProps = {
  user: UserSearchViewDto;
};

export const UserCard = ({ user }: UserCardProps) => {
  const { id, profileImage, songCount, username } = user;
  const router = useRouter();
  return (
    <div
      className='max-w-sm p-6 bg-zinc-800 rounded-lg shadow-md hover:bg-zinc-750 transition-colors cursor-pointer'
      onClick={() => router.push(`/user/${id}`)}
    >
      {/* Profile Image */}
      <div className='flex justify-center'>
        <Image
          src={profileImage}
          alt={`Profile picture of ${username}`}
          className='w-24 h-24 rounded-full'
          width={96}
          height={96}
        />
      </div>

      {/* Username */}
      <h2 className='mt-4 text-xl font-bold text-center text-zinc-100'>
        {username}
      </h2>

      {/* Song Count */}
      <p className='mt-2 text-sm text-center text-zinc-400'>
        {songCount} {songCount === 1 ? 'song' : 'songs'}
      </p>

      {/* User ID (Optional) */}
      <p className='mt-2 text-xs text-center text-zinc-500'>ID: {id}</p>
    </div>
  );
};

export const UserCardSkeleton = () => {
  return (
    <div className='max-w-sm p-6 bg-zinc-800 rounded-lg shadow-md animate-pulse'>
      {/* Profile Image Skeleton */}
      <div className='flex justify-center'>
        <div className='w-24 h-24 bg-zinc-700 rounded-full'></div>
      </div>

      {/* Username Skeleton */}
      <div className='mt-4 h-6 bg-zinc-700 rounded mx-auto w-3/4'></div>

      {/* Song Count Skeleton */}
      <div className='mt-2 h-4 bg-zinc-700 rounded mx-auto w-1/2'></div>

      {/* User ID Skeleton */}
      <div className='mt-2 h-3 bg-zinc-700 rounded mx-auto w-1/3'></div>
    </div>
  );
};

export const SearchPageComponent = () => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, query, isLoading, limit, fetchSearchResults } = useSearch();

  const router = useRouter();

  useEffect(() => {
    const query = searchParams.get('query') || '';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';

    fetchSearchResults(query, parseInt(page), parseInt(limit));
    setCurrentPage(parseInt(page));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    const query = searchParams.get('query') || '';
    const limit = searchParams.get('limit') || '20';

    const queryParam = new URLSearchParams({
      page: newPage.toString(),
      limit: limit,
      query,
    });

    router.push(`/search-user?${queryParam.toString()}`);
  };

  return (
    <>
      {/* Search Header */}
      <div className='relative w-0 h-0' aria-hidden={true}>
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className='absolute text-[8rem] md:text-[12rem] text-zinc-400 opacity-15 rotate-[-15deg] translate-y-8'
        />
      </div>

      <h1 className='text-center text-5xl text-zinc-300 font-light uppercase mt-12 mb-6'>
        Search Results
      </h1>
      {query && (
        <h2 className='text-center text-xl font-light mb-12'>
          {`Showing results for "${query}"`}
        </h2>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className='text-center text-xl font-light'>
          No results found. Try searching for something else.
        </div>
      ) : (
        <>
          {/* User Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {data.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className='flex justify-center gap-4 mt-8'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='px-4 py-2 bg-zinc-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={data.length < limit}
              className='px-4 py-2 bg-zinc-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
};
