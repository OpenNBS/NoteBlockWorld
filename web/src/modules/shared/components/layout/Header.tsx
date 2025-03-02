import {
  faMusic,
  faNewspaper,
  faQuestionCircle,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import {
  checkLogin,
  getUserData,
} from '@web/src/modules/auth/features/auth.utils';

import { BlockSearch } from './BlockSearchProps';
import { BlockTab } from './BlockTab';
import { NavLinks } from './NavLinks';
import { RandomSongButton } from './RandomSongButton';

export const Header = async () => {
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
    <header
      id='header'
      className='fixed w-[calc(100vw_-_16px)] h-14 flex flex-row justify-center items-center bg-zinc-900 border-b border-zinc-700 py-2 z-10'
    >
      {/* Navbar */}
      <nav
        id='navbar'
        className='w-full flex flex-row justify-between items-center gap-8 md:gap-12 max-w-screen-xl px-6 sm:px-10'
      >
        {/* Logo */}
        <div className='hidden lg:block flex-0 text-lg text-nowrap'>
          <picture className='w-full h-auto'>
            <Link id='logo' href='/'>
              <Image
                unoptimized
                src='/nbw-logo-flat.png'
                alt='Note Block World logo'
                className=''
                width={300}
                height={64}
              />
            </Link>
          </picture>
        </div>

        {/* Icon */}
        <div className='flex-0 flex justify-start lg:justify-center min-w-fit'>
          <Link id='icon' href='/'>
            <Image
              unoptimized
              quality={100}
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

        {/* Info pages */}
        <div className='flex flex-1 justify-center gap-1 h-8 text-center'>
          <BlockTab
            href='/'
            icon={faMusic}
            label='Songs'
            className='bg-purple-700 after:bg-purple-900 before:bg-purple-950'
            id='songs-tab'
          />
          <BlockTab
            href='/help'
            icon={faQuestionCircle}
            label='Help'
            className='bg-blue-700 after:bg-blue-900 before:bg-blue-950'
            id='help-tab'
          />
          <BlockTab
            href='/blog'
            icon={faNewspaper}
            label='Blog'
            className='bg-green-700 after:bg-green-900 before:bg-green-950'
            id='blog-tab'
          />
          <BlockTab
            href='/about'
            icon={faUser}
            label='About'
            className='bg-cyan-700 after:bg-cyan-900 before:bg-cyan-950'
            id='about-tab'
          />
          <RandomSongButton />
          <BlockSearch />
        </div>

        {/* Sign in / Profile */}
        <div id='nav-links' className='flex-0'>
          <NavLinks isUserLoggedIn={isLogged} userData={userData} />
        </div>
      </nav>
    </header>
  );
};
