'use client';

import {
  faDownload,
  faHeart,
  faPlay,
  faPlus,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SongViewDtoType } from '@shared/validation/song/dto/types';
import Image from 'next/image';

import { downloadSongFile, openSongInNBS } from '../util/downloadSong';

const UploaderBadge = ({ user }: { user: SongViewDtoType['uploader'] }) => {
  return (
    <div className='flex flex-row items-center gap-3'>
      <Image
        width={32}
        height={32}
        src={user.profileImage}
        alt=''
        className='rounded-full'
      />
      <div className='flex flex-col leading-tight h-full'>
        <p className='font-bold text-white'>{user.username}</p>
        {/* <p className='text-sm text-zinc-400'>410 followers</p> */}
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

const OpenSongInNBSButton = ({
  song,
}: {
  song: {
    publicId: string;
  };
}) => {
  return (
    <OpenInNBSButton
      handleClick={() => {
        openSongInNBS(song);
      }}
    />
  );
};

const OpenInNBSButton = ({
  handleClick,
}: {
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button
      onClick={handleClick}
      className='uppercase px-2 py-1 h-fit rounded-md text-sm bg-blue-600 hover:bg-blue-500'
    >
      <div className='flex flex-row items-center gap-2'>
        <FontAwesomeIcon icon={faPlay} />
        <div>Open in NBS</div>
      </div>
    </button>
  );
};

const DownloadSongButton = ({
  song,
}: {
  song: {
    publicId: string;
    title: string;
  };
}) => {
  return (
    <DownloadButton
      handleClick={() => {
        downloadSongFile(song);
      }}
    />
  );
};

const DownloadButton = ({
  handleClick,
}: {
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button
      onClick={handleClick}
      className='uppercase px-2 py-1 h-fit rounded-md text-sm bg-green-600 hover:bg-green-500'
    >
      <div className='flex flex-row items-center gap-2'>
        <FontAwesomeIcon icon={faDownload} />
        <div>Download</div>
      </div>
    </button>
  );
};

export {
  UploaderBadge,
  FollowButton,
  LikeButton,
  ShareButton,
  OpenSongInNBSButton,
  DownloadSongButton,
};
