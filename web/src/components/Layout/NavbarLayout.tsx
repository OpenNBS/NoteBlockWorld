import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

type TNavbarLayoutProps = {
  children: React.ReactNode;
};

const NavbarLayout = ({ children }: TNavbarLayoutProps) => {
  return (
    <>
      <div className={`w-full h-full`}>
        {/* Navbar */}
        <div className='fixed w-full h-14 flex flex-row justify-between items-center bg-zinc-900 border-b border-zinc-700 p-2 z-10'>
          {/* Logo */}
          <div className='flex-grow'>
            <figure>
              <img
                src='/nbw-white.png'
                alt='NoteBlockWorld logo'
                className='h-10 mx-auto my-2'
              />
            </figure>
          </div>

          {/* Sign in / Profile */}
          <div className='flex-shrink mr-10'>
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
          </div>
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
      </div>
    </>
  );
};

export default NavbarLayout;
