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
        className='flex-1 px-3 py-2 bg-transparent border border-zinc-700 rounded-l-full text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500'
      />
      <button
        type='submit'
        disabled={!searchQuery.trim()}
        className='px-4 py-2 pl-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-r-full transition-colors duration-200 flex items-center gap-2 cursor-pointer'
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} aria-hidden='true' />
        <span className='sr-only'>Search</span>
      </button>
    </form>
  );
}
