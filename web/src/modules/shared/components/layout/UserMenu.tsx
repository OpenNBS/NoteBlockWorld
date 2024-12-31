'use client';

import {
  faCheck,
  faClose,
  faMusic,
  faPencil,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useState } from 'react';

import { LoggedUserData } from '@web/src/modules/auth/types/User';

import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import { UserMenuLink, UserMenuSplitLine } from './UserMenuLink';
import { UserMenuButton } from '../client/UserMenuButton';

export function UserMenu({ userData }: { userData: LoggedUserData }) {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [error, setError] = useState<string>('');

  // ERRORS:
  // 'This username is not available! :('
  // 'Your username may only contain these characters: A-Z a-z 0-9 - _ .'

  return (
    <Popover onOpenChange={() => setIsEditingUsername(false)}>
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
            <div className='h-8 w-8 aspect-square'>
              <Image
                width={32}
                height={32}
                src={userData.profileImage}
                alt=''
                className='rounded-full'
              />
            </div>
            <div className='flex-shrink min-w-0 flex flex-col leading-tight'>
              <div className='flex justify-start items-center gap-2'>
                {!isEditingUsername ? (
                  <>
                    <h4 className='truncate font-semibold w-48 py-px'>
                      {userData.username}
                    </h4>
                    <button onClick={() => setIsEditingUsername(true)}>
                      <FontAwesomeIcon
                        icon={faPencil}
                        size='sm'
                        className='text-zinc-400 hover:text-zinc-200'
                      />
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      className='w-[calc(12rem-52px)] font-semibold bg-transparent border border-zinc-400 rounded-md px-1'
                      defaultValue={userData.username}
                    ></input>
                    <button onClick={() => setIsEditingUsername(false)}>
                      <FontAwesomeIcon
                        icon={faClose}
                        size='lg'
                        className='text-zinc-400 hover:text-red-500'
                      />
                    </button>
                    <button onClick={() => setIsEditingUsername(false)}>
                      <FontAwesomeIcon
                        icon={faCheck}
                        size='lg'
                        className='text-zinc-400 hover:text-green-500'
                      />
                    </button>
                  </>
                )}
              </div>
              <p className='text-zinc-300 text-xs truncate'>{userData.email}</p>
            </div>
          </div>
          {error && <p className='text-sm text-red-400 px-4 pb-2'>{error}</p>}

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
}
