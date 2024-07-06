'use client';

import { faCloudUpload, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

export function SignInButton() {
  return (
    <Link href='/login'>
      <div className=' text-nowrap flex justify-between items-center gap-2 px-1 border border-blue-500 text-blue-500 h-8 rounded-full hover:border-blue-400 hover:text-blue-400 transition-colors duration-150'>
        <div className='h-6'>
          <FontAwesomeIcon icon={faUserCircle} className='h-full' />
        </div>
        <span className='text-sm mr-2 font-semibold'>Sign in</span>
      </div>
    </Link>
  );
}

export function UploadButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href='/upload'>
          <div className='h-8 w-8 p-1'>
            <FontAwesomeIcon
              icon={faCloudUpload}
              className='!h-full text-white hover:text-zinc-400 transition-colors duration-150'
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
