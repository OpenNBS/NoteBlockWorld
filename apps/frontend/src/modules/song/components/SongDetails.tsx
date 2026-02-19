import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { UPLOAD_CONSTANTS } from '@nbw/config';
import type { SongViewDtoType } from '@nbw/database';
import {
  formatDuration,
  formatTimeSpent,
} from '@web/modules/shared/util/format';

type SongDetailsProps = {
  song: SongViewDtoType;
};

const SongDetailsRow = ({ children }: { children: React.ReactNode }) => {
  return (
    <tr className='odd:bg-zinc-800/50 even:bg-zinc-800 first:[&_td]:first:rounded-tl-xl last:[&_td]:first:rounded-bl-xl first:[&_td]:last:rounded-tr-xl last:[&_td]:last:rounded-br-xl'>
      {children}
    </tr>
  );
};

const SongDetailsCell = ({ children }: { children: React.ReactNode }) => {
  return (
    <td className='first:w-[40%] last:max-w-0 p-2 py-[10px] wrap-break-word align-top first:text-zinc-400 first:text-right last:font-bold'>
      {children}
    </td>
  );
};

const CheckOrCross = ({ check }: { check: boolean }) => {
  return check ? (
    <FontAwesomeIcon icon={faCheck} className='text-green-500' />
  ) : (
    <FontAwesomeIcon icon={faClose} className='text-red-500' />
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
  const formattedFileSize = `${(song.fileSize / 1024).toFixed(0)} kB`;
  const formattedDuration = formatDuration(stats.duration);
  const formattedTimeSpent = formatTimeSpent(stats.minutesSpent);

  let tpsLabel, bpmLabel;

  if (stats.tempoRange !== null) {
    const [minTps, maxTps] = stats.tempoRange;
    const minBpm = minTps * 15;
    const maxBpm = maxTps * 15;
    tpsLabel = `${minTps.toFixed(2)} – ${maxTps.toFixed(2)} t/s`;
    bpmLabel = `(${minBpm.toFixed(0)} – ${maxBpm.toFixed(0)} BPM)`;
  } else {
    const tps = stats.tempo;
    const bpm = tps * 15;
    tpsLabel = `${tps.toFixed(2)} t/s`;
    bpmLabel = `(${bpm.toFixed(0)} BPM)`;
  }

  const tempoInfo = (
    <>
      {tpsLabel} <span className='font-normal text-zinc-400'>{bpmLabel}</span>
    </>
  );

  const compatibleInfo = (
    <div className='flex items-center'>
      <div>
        <CheckOrCross check={stats.compatible} />
      </div>
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
            ({stats.vanillaInstrumentCount} vanilla,{' '}
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
        {row('Category', UPLOAD_CONSTANTS.categories[song.category])}
        {row('Note block compatible', compatibleInfo)}
        {row('Notes', stats.noteCount.toLocaleString('en-US'))}
        {row('Instruments', instrumentInfo)}
        {row('Layers', stats.layerCount)}
        {row('Ticks', stats.tickCount.toLocaleString('en-US'))}
        {row('Tempo', tempoInfo)}
        {row('Time signature', `${stats.timeSignature}/4`)}
        {row('Running time', formattedDuration)}
        {row('Loop', loopInfo)}
        {row('Time spent', formattedTimeSpent)}
        {row('File size', formattedFileSize)}
      </tbody>
    </table>
  );
};
