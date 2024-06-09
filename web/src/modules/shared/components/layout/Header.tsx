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
      <nav className='w-full flex flex-row justify-between items-center max-w-screen-xl px-6 sm:px-10'>
        {/* Logo */}

        <div className='hidden sm:block flex-1 text-lg text-nowrap'>
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
        <div className='flex-1 flex justify-start sm:justify-center min-w-fit'>
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
        {/* Sign in / Profile */}
        <div className='flex-1'>
          <NavLinks isUserLoggedIn={isLogged} userData={userData} />
        </div>
      </nav>
    </header>
  );
}
