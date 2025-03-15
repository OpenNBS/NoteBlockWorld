'use client';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useSearch } from './client/context/useSearch';

export const SearchPageComponent = () => {
  const searchParams = useSearchParams();
  const { results, query, fetchSearchResults } = useSearch();

  useEffect(() => {
    const query = searchParams.get('query') || '';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';

    fetchSearchResults(query, parseInt(page), parseInt(limit));
  }, []);

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

      {results.length === 0 ? (
        <div className='text-center text-xl font-light'>
          No results found. Try searching for something else.
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {JSON.stringify(results, null, 2)}
        </div>
      )}
    </>
  );
};
