import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { checkLogin, getUserData } from '@web/modules/auth/features/auth.utils';
import { UploadSongPage } from '@web/modules/song-upload/components/client/UploadSongPage';

export const metadata: Metadata = {
  title: 'Upload song',
};

async function UploadPage() {
  const isLogged = await checkLogin();
  if (!isLogged) redirect('/login?redirect=/upload');

  const userData = await getUserData();
  const username = userData?.username;

  return <UploadSongPage defaultAuthorName={username} />;
}

export default UploadPage;
