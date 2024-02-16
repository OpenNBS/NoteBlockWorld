import { SongPageView } from '../types';

type SongDetailsProps = {
  song: SongPageView;
};

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
  return formattedTime;
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
          <SongDetailsCell>{song.uploader}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Original author</SongDetailsCell>
          <SongDetailsCell>{song.originalAuthor}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>MIDI file name</SongDetailsCell>
          <SongDetailsCell>{song.midiFileName}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Category</SongDetailsCell>
          <SongDetailsCell>{song.category}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Uploaded at</SongDetailsCell>
          <SongDetailsCell>
            {song.createdAt
              ? song.createdAt.toLocaleDateString()
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
          <SongDetailsCell>Note count</SongDetailsCell>
          <SongDetailsCell>
            {song.noteCount.toLocaleString('en-US')}
          </SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Instrument count</SongDetailsCell>
          <SongDetailsCell>
            12
            <span className='font-normal text-zinc-400 ml-2'>
              (3 vanilla, 2 custom)
            </span>
          </SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Layer count</SongDetailsCell>
          <SongDetailsCell>{song.layerCount}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Tick count</SongDetailsCell>
          <SongDetailsCell>{song.tickCount}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Tempo</SongDetailsCell>
          <SongDetailsCell>
            {song.tempo} t/s{' '}
            <span className='font-normal text-zinc-400 ml-2'>
              ({song.tempo * 15} BPM)
            </span>
          </SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Running time</SongDetailsCell>
          <SongDetailsCell>
            {formatTime(song.tickCount / song.tempo)}
          </SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Time spent</SongDetailsCell>
          <SongDetailsCell>{song.minutesSpent}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>File size</SongDetailsCell>
          <SongDetailsCell>{song.fileSize / 1024} kB</SongDetailsCell>
        </SongDetailsRow>
      </tbody>
    </table>
  );
};

export default SongDetails;
