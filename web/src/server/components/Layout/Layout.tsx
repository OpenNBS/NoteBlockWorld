import { faUpload, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { checkLogin, getUserData } from '@web/src/server-side/utils';
import { LoggedUserData } from '@web/src/types/User';
import Image from 'next/image';
type TNavbarLayoutProps = {
  children: React.ReactNode;
};

async function NavbarLayout({ children }: TNavbarLayoutProps) {
  const isLogged = await checkLogin();
  let userData = undefined;
  if (isLogged) {
    console.log('User is logged in');
    userData = await getUserData();
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
          <div className='flex-grow'>
            <Image
              src='/nbw-white.png'
              alt='NoteBlockWorld logo'
              className='h-10 mx-auto my-2'
              width={40}
              height={50}
            />
          </div>
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
          <span className='text-sm text-zinc-500'>
            <p>
              © 2024{' '}
              <a href='https://opennbs.org/' className='underline'>
                OpenNBS
              </a>
            </p>
          </span>
        </div>
      </section>
    </>
  );
}

export default NavbarLayout;
function NavLinks({
  isUserLoggedIn,
  userData,
}: {
  isUserLoggedIn: boolean;
  userData?: LoggedUserData;
}) {
  return (
    <div className='grid grid-cols-2 gap-2 mr-10'>
      {!isUserLoggedIn ? (
        <a href='/login'>
          <div className='flex justify-between items-center gap-2 px-1 border border-blue-500 h-8 rounded-full'>
            <div className='h-6'>
              <FontAwesomeIcon
                icon={faUserCircle}
                className='h-full text-blue-500'
              />
            </div>
            <span className='text-sm mr-2 text-blue-400 font-semibold'>
              Sign in
            </span>
          </div>
        </a>
      ) : null}
      {isUserLoggedIn ? (
        <p className='text-sm text-zinc-500 font-semibold'>
          Logger as {userData?.username}
        </p>
      ) : null}
      <a href='/upload'>
        <div className='flex justify-between items-center gap-2 px-1 border border-green-500 h-8 rounded-full'>
          <div className='h-6'>
            <FontAwesomeIcon
              icon={faUpload}
              className='h-full text-green-500'
            />
          </div>
          <span className='text-sm mr-2 text-green-500 font-semibold'>
            Upload
          </span>
        </div>
      </a>
    </div>
  );
}
