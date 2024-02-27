import {
  faDownload,
  faHeart,
  faPlus,
  faShare,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import axios from '@web/src/lib/axios';

import SongDetails from './SongDetails';
import { SongPageView } from '../types/song.type';

const UploaderBadge = () => {
  return (
    <div className='flex flex-row items-center gap-3'>
      <img src={`/bentroen.png`} className='h-10 w-10 rounded-full' />
      <div className='flex flex-col leading-tight h-full'>
        <p className='font-bold'>Bentroen</p>
        <p className='text-sm text-zinc-400'>410 followers</p>
      </div>
    </div>
  );
};

const LikeButton = () => {
  return (
    <div className='flex flex-row gap-1'>
      <button className='uppercase px-2 py-1 h-full rounded-md text-sm font-bold bg-red-600 hover:bg-red-500 [&_div]:hover:scale-150 [&_div]:active:scale-90 [&_div]:transition-all [&_div]:duration-100'>
        <div className='flex flex-row items-center gap-2'>
          <FontAwesomeIcon icon={faHeart} />
          {/* 23 */}
        </div>
      </button>
      <CountBalloon count={23} />
    </div>
  );
};

const ShareButton = () => {
  return (
    <button className='uppercase px-2 py-1 h-fit rounded-md text-sm bg-gray-600 hover:bg-gray-500'>
      <div className='flex flex-row items-center gap-2'>
        <FontAwesomeIcon icon={faShare} />
        <div>Share</div>
      </div>
    </button>
  );
};

const DownloadButton = () => {
  return (
    <button className='uppercase px-2 py-1 h-fit rounded-md text-sm bg-green-600 hover:bg-green-500'>
      <div className='flex flex-row items-center gap-2'>
        <FontAwesomeIcon icon={faDownload} />
        <div>Download</div>
      </div>
    </button>
  );
};

const FollowButton = () => {
  return (
    <div className='flex flex-row gap-1'>
      <button className='uppercase px-2 py-1 h-fit rounded-md text-sm font-bold border border-blue-600 hover:border-blue-500 text-blue-500 hover:text-blue-400'>
        <div className='flex flex-row items-center gap-2'>
          <FontAwesomeIcon icon={faPlus} />
          <div>Follow</div>
        </div>
      </button>
      <CountBalloon count={410} />
    </div>
  );
};

const CountBalloon = ({ count }: { count: number }) => {
  return (
    <div className='flex flex-row items-center'>
      {/* Arrow */}
      <div className='w-fit'>
        <div className='relative left-1/2 w-1.5 h-1.5 bg-white transform rotate-45'></div>
      </div>

      {/* Count */}
      <div className='font-bold bg-white text-zinc-800 py-1 px-2 rounded-md'>
        <div className='text-sm'>{count}</div>
      </div>
    </div>
  );
};

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
