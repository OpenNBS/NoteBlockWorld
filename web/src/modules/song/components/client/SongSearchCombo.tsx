'use client';

import { SOUND_LIST_KEYS } from '@shared/features/sounds/constants';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import sounds from '@shared/data/soundListKeys.json';
import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../../../lib/tailwind.utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../../shared/components/client/Command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../shared/components/client/Popover';

const sounds = SOUND_LIST_KEYS;

export function SongSearchCombo({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-expanded={open}
          className='block h-full w-full border-2 text-sm text-left align-top pl-2 border-zinc-600 disabled:border-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500 overflow-clip'
        >
          {value
            ? sounds
                .find((currentSound) => currentSound === currentSound)
                ?.replace('minecraft/sounds/', '')
                .replace('.ogg', '')
            : 'Select a sound'}
          <FontAwesomeIcon
            icon={faChevronDown}
            size='sm'
            className='text-white mx-1 h-4 w-4 float-right shrink-0'
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-fit p-0 bg-zinc-900 border-2 border-zinc-500'>
        <Command>
          <CommandInput placeholder='Search sounds...' />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {(sounds as string[]).map((currentSound) => (
                <CommandItem
                  key={currentSound}
                  value={currentSound}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === currentSound ? 'opacity-100' : 'opacity-0',
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
