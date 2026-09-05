import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const EventBanner = () => {
  const targetDate = Date.UTC(2026, 7, 22, 22, 0, 0); // August is 7 (0-indexed)

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
      return `${days} day${days > 1 ? 's' : ''}`;
    }
    const hoursString = String(hours).padStart(2, '0');
    const minutesString = String(minutes).padStart(2, '0');
    const secondsString = String(seconds).padStart(2, '0');
    return `${hoursString}:${minutesString}:${secondsString}`;
  };

  return (
    <div className='flex flex-row mx-auto w-fit min-h-32 justify-between items-center text-pretty gap-6 p-4 sm:px-8 text-md rounded-xl mb-10 bg-top backdrop-filter backdrop-blur-lg bg-linear-to-br from-15% from-blue-800/50 via-blue-900/50 to-85% to-blue-900/50 relative'>
      <div
        className='absolute h-full w-full top-0 left-0 z-[-1] rounded-xl opacity-50 brightness-[0.3]'
        style={{
          backgroundImage: "url('/img/blog/summit-26/speaker-plateaus.png')",
          backgroundSize: 'cover',
          //backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '0% 75%',
        }}
      ></div>
      <Image src='/img/event/summit-icon.png' alt='' width={72} height={72} />

      <div className='flex-1 leading-tight max-w-(--breakpoint-md) w-fit'>
        <p className='uppercase text-md font-bold tracking-wider text-yellow-300 mb-1 w-fit'>
          <FontAwesomeIcon icon={faExclamationCircle} />{' '}
          {timeLeft === 0 ? (
            'Almost over!'
          ) : (
            <>Ends in {formatTime(timeLeft)}</>
          )}
        </p>
        <p>
          Attend{' '}
          <Link
            href='https://smithed.net/summit'
            className='text-blue-300 hover:text-blue-200 font-bold'
          >
            Smithed Summit
          </Link>
          , the world&apos;s largest Minecraft data pack convention — with music
          by the Note Block World community! Read our{' '}
          <Link
            href='/blog/smithed-summit-2026'
            className='text-blue-300 hover:text-blue-200'
          >
            blog post
          </Link>{' '}
          to learn more.
        </p>
      </div>
    </div>
  );
};
