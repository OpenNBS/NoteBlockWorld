import { cn } from '@/lib/utils';
import { Option, Select } from './FormElements';
import { useUploadSongProvider } from './UploadSong.context';

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
        className
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
        className
      )}
    >
      {children}
    </div>
  );
};

const InstrumentTable = () => {
  const { song } = useUploadSongProvider();
  if (!song) return null;

  const instruments = song.instruments.loaded.filter(
    (instrument) => !instrument.builtIn
  );
  console.log(instruments);
  if (!instruments) return null;

  return (
    <div className='flex flex-col w-full'>
      {/* Header */}
      <div className='flex-shrink grid grid-cols-8 pr-4'>
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
      <div className='overflow-y-scroll max-h-72 flex flex-col'>
        {instruments.map((instrument, i) => (
          <div
            key={i}
            className='grid grid-cols-8 first:[&_div]:last:rounded-bl-lg last:[&_select]:last:rounded-br-lg'
          >
            <InstrumentTableCell className='col-span-1 text-right'>
              {instrument.id - song.instruments.firstCustomIndex + 1}
            </InstrumentTableCell>
            <InstrumentTableCell className='col-span-3 truncate'>
              {instrument.meta.name.trim() || 'Unnamed instrument'}
            </InstrumentTableCell>
            <InstrumentTableCell className='col-span-1 text-right'>
              {song.layers
                .map(
                  (layer) =>
                    layer.notes.filter(
                      (note) => note.instrument === instrument.id
                    ).length
                )
                .reduce((a, b) => a + b, 0)
                .toLocaleString()}
            </InstrumentTableCell>
            <div className='col-span-3'>
              <Select className='h-9 py-0 px-1 rounded-none'>
                <Option value='none'>No sound</Option>
                {sounds.map((sound, i) => (
                  <Option key={i} value={sound.name}>
                    {sound.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InstrumentPicker = () => {
  const { song } = useUploadSongProvider();
  if (!song) return null;

  console.log(song);

  return song.instruments.loaded.length === 0 ? (
    <p className='text-center'>Sounds pretty vanilla!</p>
  ) : (
    <InstrumentTable />
  );
};

export default InstrumentPicker;