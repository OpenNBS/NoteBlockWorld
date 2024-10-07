import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faComment,
  faHeart,
  faListCheck,
} from '@fortawesome/free-solid-svg-icons';

import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import { SettingsButton } from './SignOutButton';
import { UserMenuLink } from './UserMenuLink';

export function SettingsMenu() {
  return (
    <Popover>
      <PopoverTrigger>
        <SettingsButton />
      </PopoverTrigger>
      <PopoverContent
        // We use an inset shadow as a border below because using a border makes the popover arrow shift during animation due to the extra element size. The actual menu shadow is a drop-shadow CSS filter.
        className='w-fit p-[2px] py-1.5 h-fit shadow-[inset_0px_0px_0px_2px_rgb(82_82_91)] drop-shadow-lg border-zinc-600 bg-zinc-800 text-white rounded-lg'
        sideOffset={5}
        align='end'
        alignOffset={-10}
        arrowPadding={10}
      >
        <PopoverArrow className='fill-zinc-600' />
        <div className='min-w-48 max-w-64'>
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
            <UserMenuLink href='/contact' icon={faComment} label='Contact us' />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
