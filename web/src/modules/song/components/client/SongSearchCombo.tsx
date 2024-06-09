'use client';

import { SOUND_LIST_KEYS } from '@shared/features/sounds/constants';
import { Check, ChevronsUpDown } from 'lucide-react';
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
        <button aria-expanded={open} className='w-[200px] justify-between'>
          {value
            ? sounds.find((currentSound) => currentSound === currentSound)
            : 'Select a sound'}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search framework...' />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {sounds.map((currentSound) => (
                <CommandItem
                  key={currentSound}
                  value={currentSound}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === currentSound ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {currentSound}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
