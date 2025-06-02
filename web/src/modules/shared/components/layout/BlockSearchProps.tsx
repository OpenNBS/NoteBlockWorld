'use client';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@web/src/lib/tailwind.utils';

import { Popover, PopoverContent, PopoverTrigger } from './popover';

export const BlockSearch = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          'bevel p-2 flex-1 w-8 md:min-w-20 max-w-28 flex items-center justify-center gap-2 bg-zinc-600 after:bg-zinc-800 before:bg-zinc-900 translate-y-[11px] hover:translate-y-1.5 transition-all duration-150 hover:brightness-125',
        )}
        id={'search-button'}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <span className='hidden sm:block'>Search</span>
      </PopoverTrigger>
      <PopoverContent className='w-fit p-[2px] pb-1.5 h-fit shadow-[inset_0px_0px_0px_2px_rgb(82_82_91)] drop-shadow-lg border-zinc-600 bg-zinc-800 text-white rounded-lg'>
        <div className='flex flex-row gap-2 p-4'>
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search for songs and users'
            className='w-full bg-zinc-800 text-white border border-zinc-600 rounded-md p-2'
          />
          <button
            className='bg-zinc-600 text-white rounded-md p-2 hover:bg-zinc-500 w-12 h-12'
            onClick={() => {
              const queryParam = new URLSearchParams({
                page: '1',
                limit: '20',
                query,
              });

              router.push(`/search-user?${queryParam.toString()}`);
            }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
