import { faClose, faCookieBite } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export const CookieBanner = () => {
  return (
    <div className='fixed bottom-0 w-full h-32 z-10 flex justify-center bg-blue-900/80 border-t-blue-500/80 border-t-4 border-zinc-700 backdrop-blur-md p-4'>
      <div className='relative min-w-[1280px] max-w-screen-xl px-6 sm:px-10'>
        {/* Close button */}
        <button className='absolute top-[-0.5rem] right-12 text-lg text-zinc-400 hover:text-zinc-300'>
          <FontAwesomeIcon icon={faClose} />
        </button>
        <FontAwesomeIcon
          icon={faCookieBite}
          className='text-2xl text-blue-500/80 w-6 h-6 mb-0.5'
        />
        <p className='text-sm text-zinc-300'>
          Hey, fellow note blocker! We use cookies to enhance your experience in
          accordance with our{' '}
          <Link
            href='/privacy'
            target='_blank'
            className='text-blue-400 hover:text-blue-300 hover:underline'
          >
            privacy policy
          </Link>
          . By continuing to browse this site, you agree with our use of
          cookies.
        </p>
        <p className='text-xs text-zinc-400/60'>
          No, don&apos;t eat those! They don&apos;t taste good.
        </p>
        <div className='flex justify-end gap-2'>
          <Link
            href='https://cookiesandyou.com/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-300/20 px-3 py-1.5 rounded-lg'
          >
            Learn more
          </Link>
          <button className='text-sm bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg'>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
