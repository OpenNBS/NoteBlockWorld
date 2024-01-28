'use client';

import {
  faSignOut,
  faUpload,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function SignInButton() {
  return (
    <a href='/login'>
      <div className='flex justify-between items-center gap-2 px-1 border border-blue-500 h-8 rounded-full'>
        <div className='h-6'>
          <FontAwesomeIcon
            icon={faUserCircle}
            className='h-full text-blue-500'
          />
        </div>
        <span className='text-sm mr-2 text-blue-400 font-semibold'>
          Sign in
        </span>
      </div>
    </a>
  );
}

export function SignOutButton() {
  function signOut() {
    // delete cookie
    const cookiesToBeDeleted = ['refresh_token', 'user', 'token'];
    cookiesToBeDeleted.forEach((cookie) => {
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
    // redirect to home
    window.location.href = '/';
  }

  return (
    <a onClick={signOut}>
      <div className='flex justify-between items-center gap-2 px-1 border border-yellow-500 h-8 rounded-full'>
        <div className='h-6'>
          <FontAwesomeIcon
            icon={faSignOut}
            className='h-full border-yellow-500'
          />
        </div>
        <span className='text-sm mr-2 border-yellow-400 font-semibold'>
          Sign out
        </span>
      </div>
    </a>
  );
}

export function UploadButton() {
  return (
    <a href='/upload'>
      <div className='flex justify-between items-center gap-2 px-1 border border-green-500 h-8 rounded-full'>
        <div className='h-6'>
          <FontAwesomeIcon icon={faUpload} className='h-full text-green-500' />
        </div>
        <span className='text-sm mr-2 text-green-500 font-semibold'>
          Upload
        </span>
      </div>
    </a>
  );
}

export function UserGreeting({ username }: { username: string }) {
  return (
    <p className='text-sm text-zinc-500 font-semibold'>
      Logged in as {username}
    </p>
  );
}
