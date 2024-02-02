import {
  checkLogin,
  getUserData,
} from '@web/src/modules/auth/features/auth.utils';
import Image from 'next/image';
import { redirect } from 'next/navigation';
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
    <header className='fixed w-full h-14 flex flex-row justify-between items-center bg-zinc-900 border-b border-zinc-700 p-2 z-10'>
      {/* Navbar */}
      <nav className='w-full flex flex-row justify-between items-center'>
        {/* Sign in / Profile */}
        <NavLinks
          isUserLoggedIn={isLogged ? true : false}
          userData={userData}
        />
        {/* Logo */}
        <a className='flex-grow flex justify-center' href='/'>
          <Image
            src='/nbw-white.png'
            alt='NoteBlockWorld logo'
            className='h-10 mx-auto my-2'
            width={40}
            height={50}
          />
        </a>
        {/* Sign in / Profile */}
        <NavLinks
          isUserLoggedIn={isLogged ? true : false}
          userData={userData}
        />
      </nav>
    </header>
  );
}
