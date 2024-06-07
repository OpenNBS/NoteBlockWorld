import { redirect } from 'next/navigation';

import {
  checkLogin,
  getUserData,
} from '@web/src/modules/auth/features/auth.utils';
import { UploadSongPage } from '@web/src/modules/song-upload/components/client/UploadSongPage';

async function UploadPage() {
  const isLogged = await checkLogin();
  if (!isLogged) redirect('/login?redirect=/upload');

  const userData = await getUserData();
  const username = userData?.username;

  return <UploadSongPage defaultAuthorName={username} />;
}

export default UploadPage;
