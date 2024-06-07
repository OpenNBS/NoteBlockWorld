import { EditSongPage } from '@web/src/modules/song-edit/components/client/EditSongPage';

function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return <EditSongPage id={id} />;
}

export default Page;
