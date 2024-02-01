import {
  SignInButton,
  SignOutButton,
  UploadButton,
  UserGreeting,
} from '@web/src/client/components/common/SignOutButton';
import { checkLogin, getUserData } from '@web/src/server/util/utils';
import { LoggedUserData } from '@web/src/types/User';
import Image from 'next/image';
import { redirect } from 'next/navigation';
type TNavbarLayoutProps = {
  children: React.ReactNode;
};

async function Layout({ children }: TNavbarLayoutProps) {
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
    <div
      className='w-full h-full flex flex-col justify-between items-center bg-zinc-900'
      style={{
        minHeight: '100vh',
      }}
    >
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

      {/* Main content */}
      <main className='pt-24 px-6 sm:px-10 pb-10'>{children}</main>

      {/* Footer */}
      <footer className='w-full h-12 flex flex-row justify-center items-center bg-zinc-900 border-t border-zinc-700 p-2 z-10'>
        <div className='text-sm text-zinc-500'>
          <p>
            © {new Date().getFullYear()}{' '}
            <a href='https://opennbs.org/' className='underline'>
              OpenNBS
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
function NavLinks({
  isUserLoggedIn,
  userData,
}: {
  isUserLoggedIn: boolean;
  userData?: LoggedUserData;
}) {
  return (
    <div className='flex flex-row gap-2'>
      {!isUserLoggedIn && <SignInButton />}
      {isUserLoggedIn && userData && (
        <UserGreeting username={userData.username} />
      )}
      <UploadButton />
      {isUserLoggedIn && <SignOutButton />}
    </div>
  );
}
