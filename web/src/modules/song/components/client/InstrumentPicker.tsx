import { Instrument } from '@shared/features/song/types';
import { useEffect, useState } from 'react';

import axiosInstance from '@web/src/lib/axios';
import { cn } from '@web/src/lib/tailwind.utils';

import { useSongProvider } from './context/Song.context';
import { SongSearchCombo } from './SongSearchCombo';
import { Area } from '../../../shared/components/client/FormElements';

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
  locked,
}: {
  className?: string;
  children: React.ReactNode;
  locked: boolean;
}) => {
  return (
    <div
      className={cn(
        'bg-zinc-900 border-zinc-700 border-2 px-2 py-1',
        locked ? 'text-zinc-600' : 'text-zinc-100',
        className,
      )}
    >
      {children}
    </div>
  );
};

const InstrumentTableRow = ({
  children,
  instrument,
  locked,
}: {
  children: React.ReactNode;
  instrument: Instrument;
  locked: boolean;
}) => {
  return (
    <div className='grid grid-cols-8 first:[&_div]:last:rounded-bl-lg last:[&_select]:last:rounded-br-lg'>
      <InstrumentTableCell className='col-span-1 text-right' locked={locked}>
        {instrument.id + 1}
      </InstrumentTableCell>
      <InstrumentTableCell className='col-span-3 truncate' locked={locked}>
        {instrument.name || 'Unnamed instrument'}
      </InstrumentTableCell>
      <InstrumentTableCell className='col-span-1 text-right' locked={locked}>
        {instrument.count.toLocaleString()}
      </InstrumentTableCell>
      <div className='col-span-3'>{children}</div>
    </div>
  );
};

const InstrumentTable = ({ type }: { type: 'upload' | 'edit' }) => {
  const { song, formMethods } = useSongProvider(type);

  const instruments = song?.instruments ?? [];

  const [values, setValues] = useState<Array<string>>(() => ['']);

  const setValue = (index: number, value: string) => {
    if (!values) {
      console.log('Filling values');
      setValues(Array(instruments.length).fill(''));
    }

    console.log(values);

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    formMethods.setValue('customInstruments', newValues);
  };

  async function fetchSoundList() {
    try {
      const response = await axiosInstance.get<string[]>(
        '/data/filteredSoundList.json',
        {
          withCredentials: true,
        },
      );

      const data = response.data;
      return data;
    } catch (e) {
      console.error('Error fetching sound list', e);
      return [];
    }
  }

  const [soundList, setSoundList] = useState<string[]>([]);

  useEffect(() => {
    fetchSoundList().then(setSoundList);
  }, []);

  useEffect(() => {
    if (song) {
      setValues(formMethods.getValues().customInstruments);
    }
  }, [song, formMethods]);

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
          <InstrumentTableRow
            key={i}
            instrument={instrument}
            locked={instrument.count === 0}
          >
            <SongSearchCombo
              setValue={(value: string) => {
                setValue(i, value);
              }}
              sounds={soundList}
              value={values ? values[i] : ''}
              locked={instrument.count === 0}
            />
          </InstrumentTableRow>
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
