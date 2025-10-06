'use client';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@web/modules/shared/components/layout/popover';
import { cn } from '@web/lib/tailwind.utils';
import { MusicalNote } from './MusicalNote';

export function SearchButton() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsOpen(false);
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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'bevel p-2 flex-1 w-8 md:min-w-20 max-w-28 flex items-center justify-center gap-2 bg-zinc-600 after:bg-zinc-800 before:bg-zinc-900 translate-y-[11px] hover:translate-y-1.5 transition-all duration-150 hover:brightness-125',
            'bg-orange-700 after:bg-orange-900 before:bg-orange-950',
          )}
          aria-label='Search songs'
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className='text-sm' />
          <span className='hidden sm:inline text-sm'>Search</span>
          <MusicalNote />
        </button>
      </PopoverTrigger>
      <PopoverContent className='bg-zinc-800 border border-zinc-700 shadow-xl'>
        <div className='space-y-3'>
          <h3 className='font-semibold text-zinc-100'>Search Songs</h3>
          <div className='flex gap-2'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Type your search...'
              className='flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
              autoFocus
            />
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              className='px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-white rounded transition-colors duration-200 flex items-center gap-2'
              aria-label='Search'
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
