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

        <h1 className='hidden sm:block flex-1 text-lg text-nowrap'>
          <Link href='/'>Note Block World</Link>
        </h1>
        <div className='flex-grow flex justify-start sm:justify-center min-w-fit'>
          <Link href='/'>
            <Image
              src='/nbw-white.png'
              alt='NoteBlockWorld logo'
              className='h-10 mx-auto my-2 aspect-square hover:animate-[bounce2_1s_infinite] duration-100 drop-shadow-[0_35px_35px_rgba(0.2,0.58,1,0.25)]'
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
