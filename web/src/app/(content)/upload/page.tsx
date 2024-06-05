import { redirect } from 'next/navigation';

import {
  checkLogin,
  getUserData,
} from '@web/src/modules/auth/features/auth.utils';
import { UploadSongPage } from '@web/src/modules/song-upload/components/client/UploadSong';

async function UploadPage() {
  const isLogged = await checkLogin();
  if (!isLogged) redirect('/login?redirect=/upload');

  const userData = await getUserData();
  const username = userData?.username;

  return (
    <div className='p-8 h-full w-full flex justify-center'>
      <div className='w-[75vw] max-w-[768px]'>
        <UploadSongPage defaultAuthorName={username} />
      </div>
    </div>
  );
}

export default UploadPage;
