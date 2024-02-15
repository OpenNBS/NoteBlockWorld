import { SongPage } from '@web/src/modules/song/components/SongPage';

function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return <SongPage id={id} />;
}

export default Page;
