'use client';

import {
  faDownload,
  faHeart,
  faPlus,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { downloadSongFile } from '@web/src/modules/song/util/downloadSong';

import { SongPageViewUploader } from '../types/song.type';

const UploaderBadge = ({ user }: { user: SongPageViewUploader }) => {
  return (
    <div className='flex flex-row items-center gap-3'>
      <img src={user.profileImage} className='h-10 w-10 rounded-full' />
      <div className='flex flex-col leading-tight h-full'>
        <p className='font-bold'>{user.username}</p>
        <p className='text-sm text-zinc-400'>410 followers</p>
      </div>
    </div>
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

const DownloadButton = ({ songId }: { songId: string }) => {
  return (
    <button
      onClick={() => downloadSongFile(songId)}
      className='uppercase px-2 py-1 h-fit rounded-md text-sm bg-green-600 hover:bg-green-500'
    >
      <div className='flex flex-row items-center gap-2'>
        <FontAwesomeIcon icon={faDownload} />
        <div>Download</div>
      </div>
    </button>
  );
};

export { UploaderBadge, FollowButton, LikeButton, ShareButton, DownloadButton };
