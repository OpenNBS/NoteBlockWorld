import {
  checkLogin,
  getUserData,
} from '@web/src/modules/auth/features/auth.utils';
import { getUserSongs } from '@web/src/modules/user/features/song.util';

const MySongsPage = async () => {
  const isLogged = await checkLogin();
  let userData = undefined;
  let userSongs = undefined;
  if (isLogged) {
    userData = await getUserData();
    userSongs = await getUserSongs(userData.id);
  }
  return (
    <main className='w-full h-full m-auto text-center bg-zinc-900 flex items-center justify-center'>
      <h1>My Songs</h1>
    </main>
  );
};

export default MySongsPage;
