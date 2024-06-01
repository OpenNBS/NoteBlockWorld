import { SongViewDtoType } from '@shared/validation/song/dto/types';

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
    <td className='first:w-[40%] last:w-[60%] last:max-w-0 text-ellipsis overflow-hidden whitespace-nowrap p-2 py-3 first:text-zinc-400 first:text-right last:font-bold'>
      {children}
    </td>
  );
};

const SongDetails = ({ song }: SongDetailsProps) => {
  return (
    <table className='w-full'>
      <tbody>
        <SongDetailsRow>
          <SongDetailsCell>Title</SongDetailsCell>
          <SongDetailsCell>{song.title + song.title}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Author</SongDetailsCell>
          <SongDetailsCell>{song.uploader.username}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Original author</SongDetailsCell>
          <SongDetailsCell>{song.originalAuthor}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>MIDI file name</SongDetailsCell>
          <SongDetailsCell>{song.midiFileName || '--'}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Category</SongDetailsCell>
          <SongDetailsCell>{song.category}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Uploaded at</SongDetailsCell>
          <SongDetailsCell>
            {song.createdAt
              ? new Date(song.createdAt).toLocaleString('en-UK', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : new Date().toLocaleString('en-UK', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
          </SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Note block compatible</SongDetailsCell>
          <SongDetailsCell>
            <div className='flex items-center'>
              <div className='mr-2 h-2.5 w-2.5 rounded-full bg-green-500'></div>
              <div className=''>Yes</div>
            </div>
          </SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Note count</SongDetailsCell>
          <SongDetailsCell>
            {song.noteCount.toLocaleString('en-US')}
          </SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Instrument count</SongDetailsCell>
          <SongDetailsCell>
            {song.vanillaInstrumentCount + song.customInstrumentCount}
            <span className='font-normal text-zinc-400 ml-2'>
              {`(${song.vanillaInstrumentCount} vanilla, ${song.customInstrumentCount} custom)`}
            </span>
          </SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Layer count</SongDetailsCell>
          <SongDetailsCell>{song.layerCount}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Tick count</SongDetailsCell>
          <SongDetailsCell>{(song as any).tickCount}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Tempo</SongDetailsCell>
          <SongDetailsCell>
            {song.tempo} t/s
            <span className='font-normal text-zinc-400 ml-2'>
              ({song.tempo * 15} BPM)
            </span>
          </SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Time signature</SongDetailsCell>
          <SongDetailsCell>{(song as any).timeSignature}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Running time</SongDetailsCell>
          <SongDetailsCell>
            {formatDuration((song as any).tickCount / song.tempo)}
          </SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Loop</SongDetailsCell>
          <SongDetailsCell>
            {(song as any).loop
              ? `Yes (to tick ${(song as any).loopStartTick})`
              : 'No'}
          </SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Time spent</SongDetailsCell>
          <SongDetailsCell>{(song as any).minutesSpent}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>File size</SongDetailsCell>
          <SongDetailsCell>
            {((song as any).fileSize / 1024).toFixed(2)} kB
          </SongDetailsCell>
        </SongDetailsRow>
      </tbody>
    </table>
  );
};

export default SongDetails;
