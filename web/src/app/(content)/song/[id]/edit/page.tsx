import { EditSongPage } from '@web/src/modules/song-edit/components/client/SongEditPages';

function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  // TODO: this style is repeated in the upload page, consider extracting it to a shared component
  // TODO: page styles should be moved down into the page component, or up into the layout

  return (
    <div className='p-8 h-full w-full flex justify-center'>
      <div className='w-[75vw] max-w-[768px]'>
        <EditSongPage id={id} />
      </div>
    </div>
  );
}

export default Page;
