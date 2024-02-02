import { UploadSongPage } from '@web/src/client/components/upload/UploadSong';
import { checkLogin } from '@web/src/server/util/utils';
import { redirect } from 'next/navigation';

async function UploadPage() {
  const isLogged = await checkLogin();
  if (!isLogged) redirect('/login?redirect=/upload');
  return (
    <div className='p-8 h-full w-full flex justify-center'>
      <div className='w-[75vw] max-w-[768px]'>
        <UploadSongPage />
      </div>
    </div>
  );
}

export default UploadPage;
