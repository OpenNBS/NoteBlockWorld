import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';

export const EventBanner = () => {
  return (
    <div className='flex flex-row mx-auto w-fit justify-between items-center text-pretty gap-6 py-4 px-2 sm:px-8 text-sm rounded-xl mb-10 bg-top backdrop-filter backdrop-blur-lg bg-opacity-50 bg-gradient-to-br from-15% from-pink-800 via-rose-900 to-85% to-red-900 relative'>
      <div
        className='absolute h-full w-full top-0 left-0 z-[-1] rounded-xl opacity-50 brightness-[0.3]'
        style={{
          backgroundImage: "url('/img/event/maestro-banner.png')",
          backgroundSize: 'contain',
          backgroundAttachment: 'fixed',
        }}
      ></div>
      <Image src='/img/event/maestro-icon.png' alt='' width={64} height={64} />

      <div className='flex-1 leading-tight max-w-screen-md w-fit'>
        <p className='uppercase text-sm font-bold tracking-wider text-yellow-300 mb-1 w-fit'>
          <FontAwesomeIcon icon={faExclamationCircle} /> ends in{' '}
          {Math.max(
            0,
            Math.ceil(
              (Date.UTC(2025, 9, 26, 22, 0, 0) - Date.now()) /
                (1000 * 60 * 60 * 24),
            ),
          )}{' '}
          days
        </p>
        <p>
          <span className='font-bold'>An event is underway!</span> Submit a song
          to be played in the{' '}
          <Link
            href='https://www.youtube.com/watch?v=G78AnHpIw5w'
            className='text-blue-300 hover:text-blue-200'
          >
            M.A.E.S.T.R.O. machine
          </Link>{' '}
          in the{' '}
          <span className='font-bold'>
            Students&nbsp;of&nbsp;Maestro&nbsp;Jam
          </span>
          , hosted in collaboration with{' '}
          <Link href='https://www.youtube.com/@jazziiRed'>jazziiRed</Link>,{' '}
          <Link href='https://www.youtube.com/@mr_mooncatcher'>
            mooncatcher
          </Link>
          , <Link href='https://www.youtube.com/@vladde'>vladde</Link> and{' '}
          <Link href='https://www.youtube.com/@Xoliks97'>Xoliks</Link>! Read our{' '}
          <Link
            href='/blog/maestro'
            className='text-blue-300 hover:text-blue-200'
          >
            blog post
          </Link>{' '}
          to participate.
        </p>
      </div>
    </div>
  );
};
