import {
  faMusic,
  faNewspaper,
  faQuestionCircle,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { checkLogin, getUserData } from '@web/modules/auth/features/auth.utils';

import { BlockTab } from './BlockTab';
import { NavLinks } from './NavLinks';
import { RandomSongButton } from './RandomSongButton';
import { SearchBar } from './SearchBar';

export async function Header() {
  let isLogged;
  let userData;

  try {
    isLogged = await checkLogin();
    userData = undefined;

    if (isLogged) {
      userData = await getUserData();
    }
  } catch (e) {
    redirect('/login?error=login');
  }

  return (
    <header className='fixed w-[calc(100vw-16px)] h-14 flex flex-row justify-center items-center bg-zinc-900 border-b border-zinc-700 py-2 z-10'>
      {/* Navbar */}
      <nav className='w-full flex flex-row justify-between items-center gap-8 md:gap-12 max-w-(--breakpoint-xl) px-6 sm:px-10 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
        {/* Icon */}
        <div className='flex-0 flex justify-start lg:justify-center min-w-fit'>
          <Link href='/'>
            <Image
              unoptimized
              quality={75}
              src='/nbw-color.png'
              alt='NoteBlockWorld logo'
              className='h-10 mx-auto my-2 aspect-square drop-shadow-[0_35px_35px_rgba(0.2,0.58,1,0.25)] hover:animate-[nbw-glow_3s_ease-in-out_infinite]'
              style={{
                filter: 'drop-shadow(0px 0px 4px rgba(50, 149, 255, 1))',
              }}
              width={40}
              height={40}
            />
          </Link>
        </div>

        {/* Search bar */}
        <div className='flex-1 max-w-sm'>
          <SearchBar />
        </div>

        {/* Info pages */}
        <div className='flex flex-1 justify-center gap-1 h-8 text-center'>
          <BlockTab href='/' icon={faMusic} label='Songs' color='purple' />
          <BlockTab
            href='/help'
            icon={faQuestionCircle}
            label='Help'
            color='blue'
          />
          <BlockTab
            href='/blog'
            icon={faNewspaper}
            label='Blog'
            color='green'
          />
          <BlockTab href='/about' icon={faUser} label='About' color='cyan' />
          <RandomSongButton />
        </div>

        {/* Sign in / Profile */}
        <div className='flex-0'>
          <NavLinks isUserLoggedIn={isLogged} userData={userData} />
        </div>
      </nav>
    </header>
  );
}
