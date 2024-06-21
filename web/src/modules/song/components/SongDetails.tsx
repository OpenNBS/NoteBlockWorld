import { SongViewDtoType } from '@shared/validation/song/dto/types';

import { cn } from '@web/src/lib/tailwind.utils';
import { formatDuration } from '@web/src/modules/shared/util/format';

type SongDetailsProps = {
  song: SongViewDtoType;
};

const SongDetailsRow = ({ children }: { children: React.ReactNode }) => {
  return (
    <tr className='odd:bg-zinc-800/50 even:bg-zinc-800 first:[&_td]:first:rounded-tl-xl last:[&_td]:first:rounded-tr-xl first:[&_td]:last:rounded-bl-xl last:[&_td]:last:rounded-br-xl'>
      {children}
    </tr>
  );
};

const SongDetailsCell = ({ children }: { children: React.ReactNode }) => {
  return (
    <td className='first:w-[40%] last:w-[60%] last:max-w-0 text-ellipsis overflow-hidden whitespace-nowrap p-2 py-[10px] first:text-zinc-400 first:text-right last:font-bold'>
      {children}
    </td>
  );
};

export const SongDetails = ({ song }: SongDetailsProps) => {
  // Helper function to render each detail row
  const renderDetailRow = (label: string, content: React.ReactNode) => (
    <SongDetailsRow>
      <SongDetailsCell>{label}</SongDetailsCell>
      <SongDetailsCell>{content}</SongDetailsCell>
    </SongDetailsRow>
  );

  const row = renderDetailRow;
  const stats = song.stats;

  // Pre-compute complex values
  const formattedFileSize = `${(song.fileSize / 1024).toFixed(2)} kB`;
  const formattedDuration = formatDuration(stats.duration);
  const bpm = `${stats.tempo * 15} BPM`;

  const tempoInfo = (
    <>
      {`${song.stats.tempo} t/s`}{' '}
      <span className='font-normal text-zinc-400'>{`(${bpm})`}</span>
    </>
  );

  const compatibleInfo = (
    <div className='flex items-center'>
      <div
        className={cn(
          'mr-2 h-2.5 w-2.5 rounded-full',
          stats.compatible ? 'bg-green-500' : 'bg-red-500',
        )}
      ></div>
      <div>{stats.compatible ? 'Yes' : 'No'}</div>
    </div>
  );

  const loopInfo = stats.loop ? (
    <>
      Yes{' '}
      <span className='font-normal text-zinc-400'>
        (to tick {stats.loopStartTick})
      </span>
    </>
  ) : (
    <>No</>
  );

  const totalInstruments =
    stats.vanillaInstrumentCount + stats.customInstrumentCount;

  const instrumentInfo = (
    <>
      {totalInstruments}{' '}
      <span className='font-normal text-zinc-400'>
        {stats.customInstrumentCount === 0 ? (
          <>(vanilla)</>
        ) : (
          <>
            {stats.vanillaInstrumentCount} vanilla,{' '}
            {stats.customInstrumentCount} custom)
          </>
        )}
      </span>
    </>
  );

  return (
    <table className='w-full'>
      <tbody>
        {row('Title', song.title)}
        {row('Author', song.uploader?.username)}
        {row('Original author', song.originalAuthor || '--')}
        {row('MIDI file name', song.stats.midiFileName || '--')}
        {row('Category', song.category)}
        {row('Note block compatible', compatibleInfo)}
        {row('Notes', stats.noteCount.toLocaleString('en-US'))}
        {row('Instruments', instrumentInfo)}
        {row('Layers', stats.layerCount)}
        {row('Ticks', stats.tickCount)}
        {row('Tempo', tempoInfo)}
        {row('Time signature', `${stats.timeSignature}/4`)}
        {row('Running time', formattedDuration)}
        {row('Loop', loopInfo)}
        {row('Time spent', stats.minutesSpent)}
        {row('File size', formattedFileSize)}
      </tbody>
    </table>
  );
};
