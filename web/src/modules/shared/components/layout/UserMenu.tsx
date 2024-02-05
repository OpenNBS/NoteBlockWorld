import {
  faCog,
  faMusic,
  faSignOutAlt,
  faUpload,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { LoggedUserData } from '@web/src/modules/auth/types/User';
import { UserMenuButton } from '../client/UserMenuButton';
import { UserMenuLink } from './UserMenuLink';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
} from './popover';

export function UserMenu({ userData }: { userData: LoggedUserData }) {
  return (
    <Popover>
      <PopoverTrigger>
        <UserMenuButton userData={userData} />
      </PopoverTrigger>
      <PopoverContent
        className='w-fit border-2 border-zinc-600 bg-zinc-800 text-white shadow-xl rounded-lg'
        sideOffset={10}
        align='end'
        alignOffset={-10}
      >
        <PopoverArrow
          className='fill-zinc-600'
          width={'1rem'}
          height={'0.5rem'}
        />
        <div className='flex flex-col'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>
              Logged as
              <span className='text-sm text-muted-foreground font-normal pl-1'>
                {userData.username}
              </span>
            </h4>
          </div>
          <div className='flex flex-col'>
            <UserMenuLink
              href='/upload'
              icon={faUpload}
              label='Upload a Song'
            />
            <hr className='border-neutral-200 py-1' />
            <UserMenuLink href='/my-profile' icon={faUser} label='My Profile' />
            <hr className='border-neutral-200 py-1' />
            <UserMenuLink href='/my-songs' icon={faMusic} label='My Songs' />
            <hr className='border-neutral-200 py-1' />
            <UserMenuLink href='/settings' icon={faCog} label='Settings' />
            <hr className='border-neutral-200 py-1' />
            <UserMenuLink href='/logout' icon={faSignOutAlt} label='Logout' />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
