import { faCookieBite } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export const CookieBanner = () => {
  return (
    <div className='fixed bottom-0 w-full bg-zinc-950/90 border-zinc-700 backdrop-blur-md p-4'>
      <FontAwesomeIcon icon={faCookieBite} className='text-2xl text-blue-500' />
      <p className='text-sm text-zinc-400'>
        We use cookies to enhance your experience in accordance with our{' '}
        <Link
          href='/privacy'
          target='_blank'
          className='text-blue-500 hover:underline'
        >
          privacy policy
        </Link>
        . By continuing to browse this site, you agree with our use of cookies.
        <Link
          href='https://cookiesandyou.com/'
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-400 hover:text-blue-300 hover:underline'
        >
          What are cookies?
        </Link>
      </p>
      <button className='text-sm text-blue-500 px-3 py-1.5 rounded-lg hover:underline'>
        Got it!
      </button>
    </div>
  );
};
