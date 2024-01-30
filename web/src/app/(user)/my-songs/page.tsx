import Layout from '@web/src/server/components/layout/NavbarLayout';
import { getUserSongs } from '@web/src/server/util/Song';
import { checkLogin, getUserData } from '@web/src/server/util/utils';

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
      <Layout>
        <h1>My Songs</h1>
      </Layout>
    </main>
  );
};

export default MySongsPage;
