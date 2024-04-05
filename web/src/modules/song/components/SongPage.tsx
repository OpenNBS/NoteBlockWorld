import axios from '@web/src/lib/axios';

import SongDetails from './SongDetails';
import {
  DownloadButton,
  FollowButton,
  LikeButton,
  ShareButton,
  UploaderBadge,
} from './SongPageButtons';
import { SongPageView } from '../types/song.type';

export async function SongPage({ id }: { id: string }) {
  const { data: song } = await axios.get<SongPageView>(`/song/${id}`);

  return (
    <div className='grid grid-cols-8 gap-12'>
      <div className='col-span-full lg:col-span-5 flex flex-col gap-4'>
        <img src={`/demo.png`} className='rounded-xl' />

        <h1 className='text-xl font-bold'>{song.title}</h1>

        {/* Uploader and actions */}
        <div className='flex flex-row flex-wrap justify-start items-center gap-8 w-full'>
          <UploaderBadge />
          <FollowButton />
          <div className='flex-grow'></div>
          <div className='flex flex-row gap-4'>
            <LikeButton />
            <ShareButton />
            <DownloadButton />
          </div>
        </div>

        {/* Views, upload date, description */}
        <div className='flex flex-col p-3 gap-2 bg-zinc-800 rounded-xl'>
          <div className='text-sm text-zinc-300'>221 views • 2 days ago</div>
          <p className='leading-tight'>{song.description}</p>
        </div>
      </div>

      {/* Right panel - song details */}
      <div className='col-span-full lg:col-span-3'>
        <SongDetails song={song} />
      </div>
    </div>
  );
}
