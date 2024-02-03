import {
  checkLogin,
  getUserData,
} from '@web/src/modules/auth/features/auth.utils';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { NavLinks } from './NavLinks';
import Link from 'next/link';

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
    <header className='fixed w-full h-14 flex flex-row justify-center items-center bg-zinc-900 border-b border-zinc-700 py-2 px-6 sm:px-10 z-10'>
      {/* Navbar */}
      <nav className='w-full flex flex-row justify-between items-center max-w-screen-xl'>
        {/* Logo */}

        <h1 className='flex-1 text-lg text-nowrap'>
          <Link href='/'>Note Block World</Link>
        </h1>
        <div className='flex-grow flex justify-center'>
          <Link href='/'>
            <Image
              src='/nbw-white.png'
              alt='NoteBlockWorld logo'
              className='h-10 mx-auto my-2 duration-100'
              width={40}
              height={50}
            />
          </Link>
        </div>
        {/* Sign in / Profile */}
        <div className='flex-1'>
          <NavLinks
            isUserLoggedIn={isLogged ? true : false}
            userData={userData}
          />
        </div>
      </nav>
    </header>
  );
}
