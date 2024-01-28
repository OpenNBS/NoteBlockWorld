import { UploadSong } from '@web/src/client/components/Song/UploadSong';
import { checkLogin } from '@web/src/server/util/utils';
import { redirect } from 'next/navigation';

async function UploadPage() {
  const isLogged = await checkLogin();
  if (!isLogged) redirect('/login?redirect=/upload');
  return (
    <main className='p-8 h-full w-full flex justify-center'>
      <div className='w-[75vw] max-w-[768px]'>
        <h1 className='text-3xl font-semibold'>Upload song</h1>
        <div className='h-10' />
        <UploadSong />
      </div>
    </main>
  );
}

export default UploadPage;
