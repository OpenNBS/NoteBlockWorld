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
    <>
      <section
        className='w-full h-full flex flex-col justify-between items-center bg-zinc-900'
        style={{
          minHeight: '100vh',
        }}
      >
        {/* Navbar */}
        <div className='fixed w-full h-14 flex flex-row justify-between items-center bg-zinc-900 border-b border-zinc-700 p-2 z-10'>
          {/* Logo */}
          <a className='flex-grow' href='/'>
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
        </div>

        {/* Page content */}
        <div className='bg-zinc-900 pt-24 px-6 sm:px-10 pb-10'>{children}</div>

        {/* Footer */}
        <div className='w-full h-12 flex flex-row justify-center items-center bg-zinc-900 border-t border-zinc-700 p-2 z-10'>
          <div className='text-sm text-zinc-500'>
            <p>
              © 2024{' '}
              <a href='https://opennbs.org/' className='underline'>
                OpenNBS
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
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
