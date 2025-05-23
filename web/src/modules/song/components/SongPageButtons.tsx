'use client';

import {
  faCircleNotch,
  faDownload,
  faExternalLink,
  faHeart,
  faLock,
  faPlay,
  faPlus,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SongViewDtoType } from '@shared/validation/song/dto/types';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { getTokenLocal } from '@web/src/lib/axios/token.utils';

import DownloadSongModal from './client/DownloadSongModal';
import ShareModal from './client/ShareModal';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../shared/components/tooltip';
import { downloadSongFile, openSongInNBS } from '../util/downloadSong';

const VisibilityBadge = () => {
  return (
    <span className='inline-flex items-center bg-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded-md text-sm font-semibold'>
      <FontAwesomeIcon icon={faLock} className='w-3' />
      <span className='ml-1.5'>Private</span>
    </span>
  );
};

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

const ShareButton = ({ songId }: { songId: string }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsShareModalOpen(true)}
        className='uppercase px-2 py-1 h-fit rounded-md text-sm bg-gray-600 hover:bg-gray-500'
      >
        <div className='flex flex-row items-center gap-2'>
          <FontAwesomeIcon icon={faShare} />
          <div>Share</div>
        </div>
      </button>

      <ShareModal
        isOpen={isShareModalOpen}
        setIsOpen={(isOpen: boolean) => {
          setIsShareModalOpen(isOpen);
        }}
        songId={songId}
      />
    </>
  );
};

const OpenSongInNBSButton = ({
  song,
}: {
  song: {
    publicId: string;
  };
}) => {
  const [loading, setLoading] = useState(false);

  const setLoadingTimeout = (timeoutMs: number) => {
    setTimeout(() => {
      setLoading(false);

      if (!localStorage.getItem('hideOpenFailedToast')) {
        showOpenFailedToast();
      }
    }, timeoutMs);
  };

  return (
    <OpenInNBSButton
      isLoading={loading}
      handleClick={() => {
        openSongInNBS(song);
        setLoadingTimeout(3000);
        setLoading(true);
      }}
    />
  );
};

const OpenInNBSButton = ({
  isLoading,
  handleClick,
}: {
  isLoading: boolean;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className='hidden md:block uppercase px-2 py-1 h-fit rounded-md text-sm bg-blue-600 hover:enabled:bg-blue-500 disabled:opacity-50'
    >
      <div className='flex flex-row items-center gap-2 w-max'>
        {isLoading ? (
          <FontAwesomeIcon icon={faCircleNotch} className='animate-spin w-3' />
        ) : (
          <FontAwesomeIcon icon={faPlay} className='w-3' />
        )}

        <div>Open in NBS</div>
      </div>
    </button>
  );
};

const showOpenFailedToast = () => {
  toast(
    (t) => (
      <div className='flex flex-row items-center justify-center gap-3 w-full text-sm text-white'>
        {"Didn't work?"}
        <Link
          href='https://noteblock.studio/'
          className='bg-blue-500 hover:bg-blue-400 px-2 py-1 ml-2 rounded-md'
        >
          Download NBS
          <FontAwesomeIcon
            icon={faExternalLink}
            className='w-3 opacity-50 ml-1'
          />
        </Link>
        <button
          className='text-blue-500 hover:text-blue-400'
          onClick={() => {
            toast.dismiss(t.id);
            localStorage.setItem('hideOpenFailedToast', 'true');
          }}
        >
          {"Don't show again"}
        </button>
      </div>
    ),
    {
      duration: 5000,
      style: {
        width: '100%',
      },
    },
  );
};

const DownloadSongButton = ({ song }: { song: SongViewDtoType }) => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  return (
    <>
      <DownloadButton
        downloadCount={song.downloadCount}
        handleClick={() => {
          setTimeout(() => {
            downloadSongFile(song);
          }, 3000);

          setIsDownloadModalOpen(true);
        }}
      />
      <DownloadSongModal
        isOpen={isDownloadModalOpen}
        setIsOpen={setIsDownloadModalOpen}
        song={song}
      />
    </>
  );
};

const DownloadButton = ({
  downloadCount,
  handleClick,
}: {
  downloadCount: number;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    try {
      getTokenLocal();
      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className='flex gap-0.5'>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            className='uppercase px-2 py-1 h-fit rounded-md text-sm bg-green-600 hover:enabled:bg-green-500 disabled:opacity-50'
            disabled={!isLoggedIn}
          >
            <div className='flex flex-row items-center gap-2'>
              <FontAwesomeIcon icon={faDownload} />
              <div>Download</div>
            </div>
          </button>
        </TooltipTrigger>
        {!isLoggedIn && (
          <TooltipContent>
            {'You must sign in to download this song!'}
          </TooltipContent>
        )}
      </Tooltip>
      <CountBalloon count={downloadCount} />
    </div>
  );
};

export {
  VisibilityBadge,
  UploaderBadge,
  FollowButton,
  LikeButton,
  ShareButton,
  OpenSongInNBSButton,
  DownloadSongButton,
};
