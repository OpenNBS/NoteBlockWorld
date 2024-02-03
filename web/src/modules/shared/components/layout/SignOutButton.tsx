'use client';

import { faCloudUpload, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoggedUserData } from '@web/src/modules/auth/types/User';
import Link from 'next/link';

export function SignInButton() {
  return (
    <Link href='/login'>
      <div className='flex justify-between items-center gap-2 px-1 border border-blue-500 text-blue-500 h-8 rounded-full hover:border-blue-400 hover:text-blue-400 transition-colors duration-150'>
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
    <Link href='/upload'>
      <div className='h-8 w-8 p-1'>
        <FontAwesomeIcon
          icon={faCloudUpload}
          className='h-full text-white hover:text-zinc-400 transition-colors duration-150'
        />
      </div>
    </Link>
  );
}

export function UserSettings({ userData }: { userData: LoggedUserData }) {
  return (
    <>
      <button
        className='h-8 w-8 relative'
        onClick={() => console.log('clicked')}
      >
        <img
          src='/bentroen.png'
          className='absolute top-0 left-0 h-full w-full rounded-full'
        />
        <div className='absolute top-0 left-0 h-full w-full bg-black rounded-full opacity-0 hover:opacity-30 transition-opacity duration-150'></div>
      </button>
    </>
  );
}
