'use client';

import Image from 'next/image';

import { LoggedUserData } from '@web/modules/auth/types/User';


export function UserMenuButton({ userData }: { userData: LoggedUserData }) {
  return (
    <>
      <div className='h-8 w-8 relative'>
        <Image
          width={32}
          height={32}
          src={userData.profileImage}
          alt=''
          className='rounded-full'
        />
        <div className='absolute top-0 left-0 h-full w-full bg-black rounded-full opacity-0 hover:opacity-30 transition-opacity duration-150'></div>
      </div>
    </>
  );
}
