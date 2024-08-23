import {
  faMusic,
  faNewspaper,
  faQuestionCircle,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import {
  checkLogin,
  getUserData,
} from '@web/src/modules/auth/features/auth.utils';

import { NavLinks } from './NavLinks';

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
    <header className='fixed w-[calc(100vw_-_16px)] h-14 flex flex-row justify-center items-center bg-zinc-900 border-b border-zinc-700 py-2 z-10'>
      {/* Navbar */}
      <nav className='w-full flex flex-row justify-between items-center gap-8 md:gap-12 max-w-screen-xl px-6 sm:px-10'>
        {/* Logo */}
        <div className='hidden lg:block flex-0 text-lg text-nowrap'>
          <picture className='w-full h-auto'>
            <Link href='/'>
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
          <Link href='/'>
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
          <Link
            href='/'
            className='bevel p-2 flex-1 sm:min-w-20 max-w-28 flex items-center justify-center gap-2 bg-purple-700 after:bg-purple-900 before:bg-purple-950 translate-y-[11px] hover:translate-y-1.5 transition-all duration-150 hover:brightness-125'
          >
            <FontAwesomeIcon icon={faMusic} />
            <span className='hidden sm:block'>Songs</span>
          </Link>
          <Link
            href='/help'
            className='bevel p-2 flex-1 sm:min-w-20 max-w-28 flex items-center justify-center gap-2 bg-blue-700 after:bg-blue-900 before:bg-blue-950 translate-y-[11px] hover:translate-y-1.5 transition-all duration-150 hover:brightness-125'
          >
            <FontAwesomeIcon icon={faQuestionCircle} />
            <span className='hidden sm:block'>Help</span>
          </Link>
          <Link
            href='/blog'
            className='bevel p-2 flex-1 sm:min-w-20 max-w-28 flex items-center justify-center gap-2 bg-green-700 after:bg-green-900 before:bg-green-950 translate-y-[11px] hover:translate-y-1.5 transition-all duration-150 hover:brightness-125'
          >
            <FontAwesomeIcon icon={faNewspaper} />
            <span className='hidden sm:block'>Blog</span>
          </Link>
          <Link
            href='/about'
            className='bevel p-2 flex-1 sm:min-w-20 max-w-28 flex items-center justify-center gap-2 bg-cyan-700 after:bg-cyan-900 before:bg-cyan-950 translate-y-[11px] hover:translate-y-1.5 transition-all duration-150 hover:brightness-125'
          >
            <FontAwesomeIcon icon={faUser} />
            <span className='hidden sm:block'>About</span>
          </Link>
        </div>

        {/* Sign in / Profile */}
        <div className='flex-0'>
          <NavLinks isUserLoggedIn={isLogged} userData={userData} />
        </div>
      </nav>
    </header>
  );
}
