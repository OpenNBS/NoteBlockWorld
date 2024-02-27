import {
  faMusic,
  faSignOutAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

import { LoggedUserData } from '@web/src/modules/auth/types/User';

import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import { RandomAvatar } from './RandomAvatar';
import { UserMenuLink, UserMenuSplitLine } from './UserMenuLink';
import { UserMenuButton } from '../client/UserMenuButton';

export function UserMenu({ userData }: { userData: LoggedUserData }) {
  return (
    <Popover>
      <PopoverTrigger>
        <UserMenuButton userData={userData} />
      </PopoverTrigger>
      <PopoverContent
        className='w-fit p-0 pb-2 border-2 border-zinc-600 bg-zinc-800 text-white shadow-xl rounded-lg'
        sideOffset={10}
        align='end'
        alignOffset={-10}
      >
        <PopoverArrow
          className='fill-zinc-600'
          width={'1rem'}
          height={'0.5rem'}
        />
        <div className='min-w-48 max-w-64'>
          {/* User */}
          <div className='flex flex-row gap-2 items-center p-4 pb-2'>
            <div className='h-8 w-8'>
              <RandomAvatar
                mode={'pattern'}
                name={userData.username}
                size={32}
              />
            </div>
            <div className='flex-shrink min-w-0 flex flex-col leading-tight'>
              <h4 className='truncate font-semibold'>{userData.username}</h4>
              <p className='text-zinc-300 text-xs truncate'>{userData.email}</p>
            </div>
          </div>

          <UserMenuSplitLine />

          {/* Links */}
          <div className='flex flex-col'>
            <UserMenuLink href='/my-profile' icon={faUser} label='Profile' />
            <UserMenuLink href='/my-songs' icon={faMusic} label='My songs' />
            <UserMenuLink href='/logout' icon={faSignOutAlt} label='Log out' />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
