'use client';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form
      role='search'
      aria-label='Search songs'
      onSubmit={handleSubmit}
      className='flex'
      autoComplete='off'
    >
      <label htmlFor='song-search' className='sr-only'>
        Search songs
      </label>
      <input
        id='song-search'
        name='q'
        type='search'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder='Search songs'
        enterKeyHint='search'
        autoComplete='off'
        autoCorrect='off'
        autoCapitalize='none'
        spellCheck={false}
        className='flex-1 px-3 py-2 pr-1 bg-transparent border border-zinc-700 rounded-l-full text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500'
      />
      <button
        type='submit'
        disabled={!searchQuery.trim()}
        className='px-4 py-2 pl-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-r-full transition-colors duration-200 flex items-center gap-2 cursor-pointer'
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden='true' />
        <span className='sr-only'>Search</span>
      </button>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        /* Make the native WebKit clear (x) button white */
        :global(#song-search::-webkit-search-cancel-button) {
          -webkit-appearance: none;
          appearance: none;
          height: 1rem;
          width: 1rem;
          background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='18' y1='6' x2='6' y2='18'/><line x1='6' y1='6' x2='18' y2='18'/></svg>")
            no-repeat center center;
          cursor: pointer;
        }

        /* Remove WebKit autofill background if it appears */
        :global(#song-search:-webkit-autofill) {
          -webkit-text-fill-color: white;
          transition: background-color 9999s ease-out;
        }
      `}</style>
    </form>
  );
}
