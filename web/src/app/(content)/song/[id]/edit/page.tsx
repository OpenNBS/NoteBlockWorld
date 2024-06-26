import { redirect } from 'next/navigation';

import { checkLogin } from '@web/src/modules/auth/features/auth.utils';
import { EditSongPage } from '@web/src/modules/song-edit/components/client/EditSongPage';

async function Page({ params }: { params: { id: string } }) {
  const isLogged = await checkLogin();
  if (!isLogged) redirect('/login?redirect=/upload');

  const { id } = params;

  return <EditSongPage id={id} />;
}

export default Page;
