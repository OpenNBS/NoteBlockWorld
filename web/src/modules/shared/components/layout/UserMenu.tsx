'use client';
import {
  faMusic,
  faPen,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

import { LoggedUserData } from '@web/src/modules/auth/types/User';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { UserMenuButton } from '../client/UserMenuButton';
import { EditUsernameModal } from './EditUsernameModal';
import { UserMenuLink, UserMenuSplitLine } from './UserMenuLink';
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from './popover';

export const UserMenu = ({ userData }: { userData: LoggedUserData }) => {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  return (
    <Popover>
      <EditUsernameModal
        isOpen={isEditingUsername}
        setIsOpen={setIsEditingUsername}
        userData={userData}
      />
      <PopoverTrigger>
        <UserMenuButton userData={userData} />
      </PopoverTrigger>
      <PopoverContent
        // We use an inset shadow as a border below because using a border makes the popover arrow shift during animation due to the extra element size. The actual menu shadow is a drop-shadow CSS filter.
        className='w-fit p-[2px] pb-1.5 h-fit shadow-[inset_0px_0px_0px_2px_rgb(82_82_91)] drop-shadow-lg border-zinc-600 bg-zinc-800 text-white rounded-lg'
        sideOffset={5}
        align='end'
        alignOffset={-10}
        arrowPadding={10}
      >
        <PopoverArrow className='fill-zinc-600' />
        <div className='min-w-48 max-w-64'>
          {/* User */}
          <div className='flex flex-row gap-2 items-center p-4 pb-3'>
            <div className='h-8 w-8'>
              <Image
                width={32}
                height={32}
                src={userData.profileImage}
                alt=''
                className='rounded-full'
              />
            </div>
            <div className='flex-shrink min-w-0 flex flex-col leading-tight'>
              <h4 className='truncate font-semibold'>
                {userData.username}
                <button
                  className='ml-1 text-zinc-300 hover:text-white'
                  onClick={() => setIsEditingUsername(true)}
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
              </h4>
              <p className='text-zinc-300 text-xs truncate'>{userData.email}</p>
            </div>
          </div>

          <UserMenuSplitLine />

          {/* Links */}
          <div className='flex flex-col'>
            {/* <UserMenuLink href='/my-profile' icon={faUser} label='Profile' /> */}
            <UserMenuLink href='/my-songs' icon={faMusic} label='My songs' />
            <UserMenuLink href='/logout' icon={faSignOutAlt} label='Sign out' />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
