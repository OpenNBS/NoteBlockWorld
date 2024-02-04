'use client';

import { LoggedUserData } from '@web/src/modules/auth/types/User';
import { RandomAvatar } from 'react-random-avatars';

export function UserMenuButton({ userData }: { userData: LoggedUserData }) {
  return (
    <>
      <button className='h-8 w-8 relative'>
        <RandomAvatar mode={'pattern'} name={userData.username} size={30} />
        {/*
        <img
        src='/bentroen.png'
        className='absolute top-0 left-0 h-full w-full rounded-full'
        />
        */}
        <div className='absolute top-0 left-0 h-full w-full bg-black rounded-full opacity-0 hover:opacity-30 transition-opacity duration-150'></div>
      </button>
    </>
  );
}
