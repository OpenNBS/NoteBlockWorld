type SongDetailsProps = {
  song: {
    originalAuthor: string;
    createdAt: string;
    visibility: string;
    allowDownload: boolean;
  };
};

const SongDetailsRow = ({ children }: { children: React.ReactNode }) => {
  return <tr className='odd:bg-zinc-800'>{children}</tr>;
};

const SongDetailsCell = ({ children }: { children: React.ReactNode }) => {
  return (
    <td className='w-auto first:w-[40%] whitespace-nowrap p-2 first:text-zinc-300 first:text-right last:font-bold'>
      {children}
    </td>
  );
};

const SongDetails = ({ song }: SongDetailsProps) => {
  return (
    <table className='w-full'>
      <tbody>
        <SongDetailsRow>
          <SongDetailsCell>Original author</SongDetailsCell>
          <SongDetailsCell>{song.originalAuthor}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Uploaded</SongDetailsCell>
          <SongDetailsCell>{song.createdAt}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Visibility</SongDetailsCell>
          <SongDetailsCell>{song.visibility}</SongDetailsCell>
        </SongDetailsRow>
        <SongDetailsRow>
          <SongDetailsCell>Downloadable</SongDetailsCell>
          <SongDetailsCell>{song.allowDownload ? 'Yes' : 'No'}</SongDetailsCell>
        </SongDetailsRow>
      </tbody>
    </table>
  );
};

export default SongDetails;
