'use client';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search-song?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='flex'>
      <input
        type='text'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Search songs...'
        className='flex-1 px-3 py-2 bg-transparent border border-zinc-700 rounded-l-full text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:border-transparent'
        autoFocus
      />
      <button
        onClick={handleSearch}
        disabled={!searchQuery.trim()}
        className='px-4 py-2 pl-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-r-full transition-colors duration-200 flex items-center gap-2'
        aria-label='Search'
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </div>
  );
}
