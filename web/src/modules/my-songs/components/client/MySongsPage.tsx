// import { useMySongsProvider } from './MySongs.context';
import { MySongsSongDTO } from './MySongs.context';

const SongRow = ({ song }: { song: MySongsSongDTO }) => {
  return (
    <tr key={song.id}>
      <td>
        <SongRow song={song} />
      </td>
      <td>{song.visibility}</td>
      <td>{song.createdAt}</td>
      <td>{song.playCount}</td>
      <td>
        <button>Edit</button>
        <button>Delete</button>
      </td>
    </tr>
  );
};

const MySongsPage = ({ userSongs }: { userSongs: MySongsSongDTO[] }) => {
  // const { isLogged, userData, userSongs } = useMySongsProvider();

  return (
    <>
      <h1 className='text-3xl font-semibold uppercase'>My songs</h1>
      <div className='h-10'></div>
      <table className='table-auto min-w-[600px] text-lg rounded-lg'>
        <thead className='bg-zinc-700 rounded-lg'>
          <tr className='rounded-lg'>
            <th>Song</th>
            <th>Visibility</th>
            <th>Date</th>
            <th>Play count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userSongs.map((song) => (
            <SongRow key={song.id} song={song} />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default MySongsPage;
