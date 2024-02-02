import {
  checkLogin,
  getUserData,
} from '@web/src/modules/auth/features/auth.utils';
import { getUserSongs } from '@web/src/modules/user/features/song.util';
import Page from '@web/src/modules/my-songs/components/MySongsPage';
import { redirect } from 'next/navigation';
import { MySongsSongDTO } from '@web/src/modules/my-songs/components/client/MySongs.context';

const MySongsPage = async () => {
  // TODO: Next.js extends fetch() to memoize the result of multiple requests to the same URL.
  // Can we use this to avoid the duplicate call to checkLogin()?
  // https://nextjs.org/docs/app/building-your-application/caching#request-memoization

  return <Page userSongs={[]} />;
  const isLogged = await checkLogin();
  if (!isLogged) redirect('/login?redirect=/my-songs');

  let userData = await getUserData();
  let userSongs = (await getUserSongs(userData.id)) as MySongsSongDTO[];

  return <Page userSongs={userSongs} />;
};

export default MySongsPage;
