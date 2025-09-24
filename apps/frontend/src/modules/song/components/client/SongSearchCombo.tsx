'use client';

import { faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

import { cn } from '../../../../lib/tailwind.utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../../../shared/components/client/Command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../shared/components/client/Popover';

export function SongSearchCombo({
  value,
  setValue,
  sounds,
  locked
}: {
  value   : string;
  setValue: (value: string) => void;
  sounds  : string[];
  locked  : boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  let returnCount = 0;

  const filteredSounds = sounds
    .filter((sound) => {
      if (
        returnCount < 100 &&
        sound.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        returnCount++;
        return true;
      }

      return false;
    })
    .sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true })
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-expanded={open}
          className='block relative w-full h-full border-2 text-sm text-left pl-2 border-zinc-600 disabled:border-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500 overflow-clip'
          disabled={locked}
        >
          {value ? (
            value.replace('minecraft/sounds/', '').replace('.ogg', '')
          ) : (
            <span className={!locked ? 'text-orange-400 font-bold' : ''}>
              No sound
            </span>
          )}
          <FontAwesomeIcon
            icon={faChevronDown}
            size='sm'
            className={cn(
              'absolute right-0 top-2.5 mx-1 w-3 shrink-0',
              locked ? 'text-zinc-600' : 'text-zinc-300'
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-fit p-0 bg-zinc-900 border-2 border-zinc-500'>
        <Command>
          <CommandInput
            placeholder='Search sounds...'
            onInput={(e) => setSearchTerm(e.currentTarget.value)}
            defaultValue={searchTerm}
          />
          <CommandList>
            <CommandEmpty>No sounds found</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value=''
                onSelect={(currentValue: string) => {
                  setValue(currentValue);
                  setOpen(false);
                }}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  size='sm'
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === '' ? 'opacity-100' : 'opacity-0'
                  )}
                />
                No sound
              </CommandItem>
              {filteredSounds.map((currentSound) => (
                <CommandItem
                  key={currentSound}
                  value={currentSound}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue);
                    setOpen(false);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    size='sm'
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === currentSound ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {currentSound
                    .replace('minecraft/sounds/', '')
                    .replace('.ogg', '')}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
