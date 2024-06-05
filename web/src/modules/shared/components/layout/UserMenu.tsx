import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faHeart,
  faListCheck,
  faMusic,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

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
  return (
    <Popover>
      <PopoverTrigger>
        <UserMenuButton userData={userData} />
      </PopoverTrigger>
      <PopoverContent
        className='w-fit p-[2px] h-fit box-border shadow-[inset_0px_0px_0px_2px_rgb(82_82_91)] border-zinc-600 bg-zinc-800 text-white rounded-lg'
        sideOffset={10}
        align='end'
        alignOffset={-10}
        arrowPadding={10}
      >
        <div className='shadow-xl pb-2'>
          <PopoverArrow className='fill-zinc-600' />
          <div className='min-w-48 max-w-64'>
            {/* User */}
            <div className='flex flex-row gap-2 items-center p-4 pb-2'>
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
                <h4 className='truncate font-semibold'>{userData.username}</h4>
                <p className='text-zinc-300 text-xs truncate'>
                  {userData.email}
                </p>
              </div>
            </div>

            <UserMenuSplitLine />

            {/* Links */}
            <div className='flex flex-col'>
              {/* <UserMenuLink href='/my-profile' icon={faUser} label='Profile' /> */}
              <UserMenuLink href='/my-songs' icon={faMusic} label='My songs' />
              <UserMenuLink
                href='/logout'
                icon={faSignOutAlt}
                label='Sign out'
              />
            </div>

            <UserMenuSplitLine />

            <div className='flex flex-col'>
              <UserMenuLink
                href='https://github.com/OpenNBS/NoteBlockWorld'
                icon={faGithub}
                label='GitHub'
                external
              />
              <UserMenuLink
                href='https://github.com/orgs/OpenNBS/projects/4'
                icon={faListCheck}
                label='Roadmap'
                external
              />
              <UserMenuLink
                href='https://opencollective.com/opennbs/donate/profile'
                icon={faHeart}
                label='Donate'
                external
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
