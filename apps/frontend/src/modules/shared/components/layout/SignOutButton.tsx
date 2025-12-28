'use client';

import {
  faCloudUpload,
  faCog,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

export function SignInButton() {
  return (
    <Link href='/login'>
      <div className='text-nowrap flex justify-between items-center gap-2 md:px-1 md:border border-blue-500 text-white md:text-blue-500 h-8 rounded-full hover:border-blue-400 hover:text-blue-400 transition-colors duration-150'>
        <div className='h-8 p-1 md:h-6 md:p-0'>
          <FontAwesomeIcon icon={faUserCircle} className='h-full!' />
        </div>
        <span className='text-sm mr-2 font-semibold hidden md:block'>
          Sign in
        </span>
      </div>
    </Link>
  );
}

export function UploadButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href='/upload'>
          <div className='group h-9 w-9 p-1'>
            <FontAwesomeIcon
              icon={faCloudUpload}
              className='h-full! w-full! text-white group-hover:text-zinc-400 transition-colors duration-150'
            />
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <span className='text-xs'>Upload a song</span>
      </TooltipContent>
    </Tooltip>
  );
}

export function SettingsButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className='group h-8 w-8 p-1'>
          <FontAwesomeIcon
            icon={faCog}
            className='h-full! w-full! text-white group-hover:text-zinc-400 transition-all duration-150 group-hover:rotate-45'
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <span className='text-xs'>Settings</span>
      </TooltipContent>
    </Tooltip>
  );
}
