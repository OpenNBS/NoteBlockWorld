import { useState } from 'react';

import { cn } from '@web/src/lib/tailwind.utils';

import { useSongProvider } from './context/Song.context';
import { SongSearchCombo } from './SongSearchCombo';
import { Area } from '../../../shared/components/client/FormElements';

const sounds = [
  { name: 'sound1' },
  { name: 'sound2' },
  { name: 'sound3' },
  { name: 'sound4' },
  { name: 'entity/firework_rocket/blast_far.ogg' },
];

const InstrumentTableHeader = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'bg-zinc-800 border-zinc-600 border-2 px-2 py-1 text-zinc-400 font-semibold first:rounded-tl-lg last:rounded-tr-lg',
        className,
      )}
    >
      {children}
    </div>
  );
};

const InstrumentTableCell = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'bg-zinc-900 border-zinc-700 border-2 px-2 py-1',
        className,
      )}
    >
      {children}
    </div>
  );
};

const InstrumentTable = ({ type }: { type: 'upload' | 'edit' }) => {
  const { song } = useSongProvider(type);
  const [value, setValue] = useState('');
  if (!song) return null;

  const instruments = song.instruments;

  return (
    <div className='flex flex-col w-full'>
      {/* Header */}
      <div className='flex-shrink grid grid-cols-8'>
        <InstrumentTableHeader className='text-right'>#</InstrumentTableHeader>
        <InstrumentTableHeader className='col-span-3'>
          Instrument
        </InstrumentTableHeader>
        <InstrumentTableHeader className='col-span-1'>
          Blocks
        </InstrumentTableHeader>
        <InstrumentTableHeader className='col-span-3'>
          Sound file
        </InstrumentTableHeader>
      </div>

      {/* Instruments */}
      <div className='overflow-y-scroll max-h-72 flex flex-col mr-[-1rem]'>
        {instruments.map((instrument, i) => (
          <div
            key={i}
            className='grid grid-cols-8 first:[&_div]:last:rounded-bl-lg last:[&_select]:last:rounded-br-lg'
          >
            <InstrumentTableCell className='col-span-1 text-right'>
              {instrument.id + 1}
            </InstrumentTableCell>
            <InstrumentTableCell className='col-span-3 truncate'>
              {instrument.name || 'Unnamed instrument'}
            </InstrumentTableCell>
            <InstrumentTableCell className='col-span-1 text-right'>
              {instrument.count.toLocaleString()}
            </InstrumentTableCell>
            <div className='col-span-3'>
              <SongSearchCombo setValue={setValue} value={value} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InstrumentPicker = ({ type }: { type: 'upload' | 'edit' }) => {
  const { song } = useSongProvider(type);
  if (!song) return null;

  const customInstrumentCount = song.instruments.length;

  return customInstrumentCount === 0 ? (
    <Area label=''>
      <p className='text-center italic text-zinc-400'>Sounds pretty vanilla!</p>
    </Area>
  ) : (
    <InstrumentTable type={type} />
  );
};

export default InstrumentPicker;
