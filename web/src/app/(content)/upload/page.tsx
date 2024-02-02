import { checkLogin } from '@web/src/modules/auth/features/auth.utils';
import { UploadSongPage } from '@web/src/modules/upload/components/client/UploadSong';
import { redirect } from 'next/navigation';

async function UploadPage() {
  const isLogged = await checkLogin();
  if (!isLogged) redirect('/login?redirect=/upload');
  return (
    <main className='p-8 h-full w-full flex justify-center'>
      <div className='w-[75vw] max-w-[768px]'>
        <UploadSongPage />
      </div>
    </main>
  );
}

export default UploadPage;
