import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const EventBanner = () => {
  const targetDate = Date.UTC(2026, 5, 16, 17, 0, 0); // June is 5 (0-indexed)

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
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${String(days).padStart(2, '0')} days`;
    }
    return `${String(days).padStart(2, '0')}d ${String(hours).padStart(
      2,
      '0',
    )}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className='flex flex-row mx-auto w-fit h-32 justify-between items-center text-pretty gap-6 py-4 px-2 sm:px-8 text-md rounded-xl mb-10 bg-top backdrop-filter backdrop-blur-lg bg-linear-to-br from-15% from-blue-800/50 via-blue-900/50 to-85% to-blue-900/50 relative'>
      <div
        className='absolute h-full w-full top-0 left-0 z-[-1] rounded-xl opacity-50 brightness-[0.3]'
        style={{
          backgroundImage: "url('/img/event/summit26-banner.png')",
          backgroundSize: 'cover',
          //backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0% 100%',
        }}
      ></div>
      <Image src='/img/event/summit-icon.png' alt='' width={72} height={72} />

      <div className='flex-1 leading-tight max-w-(--breakpoint-md) w-fit'>
        <p className='uppercase text-md font-bold tracking-wider text-yellow-300 mb-1 w-fit'>
          <FontAwesomeIcon icon={faExclamationCircle} />{' '}
          {timeLeft === 0 ? (
            'The event is over!'
          ) : (
            <>Ends in {formatTime(timeLeft)}</>
          )}
        </p>
        <p>
          Submit your songs to be played at{' '}
          <Link
            href='https://www.youtube.com/watch?v=G78AnHpIw5w'
            className='text-blue-300 hover:text-blue-200 font-bold'
          >
            Smithed Summit
          </Link>
          , the one and only Minecraft data pack convention! Read our{' '}
          <Link
            href='/blog/smithed-summit-2026'
            className='text-blue-300 hover:text-blue-200'
          >
            blog post
          </Link>{' '}
          to learn more, or{' '}
          <Link
            href='/search?q=%23summit26'
            className='text-blue-300 hover:text-blue-200'
          >
            browse the entries
          </Link>{' '}
          submitted so far.
        </p>
      </div>
    </div>
  );
};
