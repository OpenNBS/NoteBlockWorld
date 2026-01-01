import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const EventBanner = () => {
  const targetDate = Date.UTC(2025, 10, 8, 17, 0, 0); // November is 10 (0-indexed)

  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, targetDate - Date.now()),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, targetDate - Date.now()));
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [targetDate]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className='flex flex-row mx-auto w-fit justify-between items-center text-pretty gap-6 py-4 px-2 sm:px-8 text-md rounded-xl mb-10 bg-top backdrop-filter backdrop-blur-lg bg-opacity-50 bg-gradient-to-br from-15% from-pink-800 via-rose-900 to-85% to-red-900 relative'>
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
        <p className='uppercase text-md font-bold tracking-wider text-yellow-300 mb-1 w-fit'>
          <FontAwesomeIcon icon={faExclamationCircle} />{' '}
          {timeLeft === 0 ? (
            'Happening NOW!'
          ) : (
            <>Starting in {formatTime(timeLeft)}</>
          )}
        </p>
        <p>
          Watch your songs played LIVE in the{' '}
          <Link
            href='https://www.youtube.com/watch?v=G78AnHpIw5w'
            className='text-blue-300 hover:text-blue-200'
          >
            M.A.E.S.T.R.O. machine
          </Link>{' '}
          on{' '}
          <span className='font-bold'>Maestro&apos;s Musical Masterpieces</span>
          , a public performance featuring the machine&apos;s creators! Live on{' '}
          <Link
            href='https://youtube.com/live/d0_A3GMuGJ8'
            className='text-blue-300 hover:text-blue-200'
          >
            YouTube
          </Link>{' '}
          and{' '}
          <Link
            href='https://discord.gg/note-block-world-608692895179997252'
            className='text-blue-300 hover:text-blue-200'
          >
            Discord
          </Link>
          . Read our{' '}
          <Link
            href="/blog/maestro's_musical_masterpieces"
            className='text-blue-300 hover:text-blue-200'
          >
            blog post
          </Link>{' '}
          for more!
        </p>
      </div>
    </div>
  );
};
