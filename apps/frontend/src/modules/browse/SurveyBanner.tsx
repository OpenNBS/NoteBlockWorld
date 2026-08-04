'use client';

import {
  faChartSimple,
  faExclamationCircle,
  faExternalLink,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const SURVEY_LINK = 'https://forms.gle/3eY4Lktd1tQkZ2mt8';
const STORAGE_KEY = 'surveyBannerClosed';

export const SurveyBanner = () => {
  return (
    <div className='flex flex-row mx-auto w-fit min-h-32 justify-between items-center text-pretty gap-6 p-4 sm:px-8 text-md rounded-xl mb-10 bg-top backdrop-filter backdrop-blur-lg bg-linear-to-br from-15% from-green-300/50 via-green-400/50 to-85% to-emerald-600/50 relative'>
      <div
        className='absolute h-full w-full top-0 left-0 z-[-1] rounded-xl opacity-50 brightness-[0.3]'
        style={{
          backgroundImage: "url('/background-tile-flat.png')",
          backgroundSize: 'auto',
          //backgroundAttachment: 'fixed',
          backgroundRepeat: 'repeat',
          backgroundPosition: '0% 100%',
        }}
      ></div>
      <FontAwesomeIcon
        icon={faChartSimple}
        className='text-green-300 text-4xl'
      />

      <div className='flex-1 leading-tight max-w-(--breakpoint-md) w-fit'>
        <p className='uppercase text-md font-bold tracking-wider text-yellow-300 mb-1 w-fit'>
          <FontAwesomeIcon icon={faExclamationCircle} /> Help us out in
          research!
        </p>
        <p>
          We&apos;re doing <span className='font-bold'>original research</span>{' '}
          on the note block community! Answer our{' '}
          <span className='font-bold'>10-minute survey</span> and help us build
          the future of Note Block World.{' '}
          <Link
            href={SURVEY_LINK}
            target='_blank'
            className='text-blue-300 hover:text-blue-200 font-bold underline'
          >
            Click here to start
          </Link>
        </p>
      </div>
    </div>
  );
};

export const MiniSurveyBanner = ({
  permanent = false,
}: {
  permanent?: boolean;
}) => {
  const pathname = usePathname();
  const canDismiss = !permanent;
  // Start closed to avoid a dismiss flash; open after mount if eligible.
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/') return;
    if (!canDismiss || localStorage.getItem(STORAGE_KEY) !== 'true') {
      setIsOpen(true);
    }
  }, [canDismiss, pathname]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!isOpen || pathname === '/') return null;

  return (
    <div className='relative flex items-center justify-center gap-2 mt-4 mb-5 bg-emerald-800 border-emerald-400 text-emerald-300 border-2 rounded-lg px-3 py-1.5 text-sm'>
      {canDismiss && (
        <button
          type='button'
          onClick={handleClose}
          aria-label='Dismiss survey banner'
          className='absolute top-1 right-1.5 text-emerald-400 hover:text-emerald-200'
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
      <FontAwesomeIcon icon={faChartSimple} className='h-5' />
      <p className={`leading-4.5 ${canDismiss ? 'pr-4' : ''}`}>
        Answer our{' '}
        <Link
          href={SURVEY_LINK}
          target='_blank'
          className='text-blue-400 hover:text-blue-300 hover:underline'
        >
          10-minute survey
        </Link>
        <FontAwesomeIcon
          className='text-blue-400 font-bold ml-1 mr-1'
          size='xs'
          icon={faExternalLink}
        />{' '}
        and help us improve your experience!
      </p>
    </div>
  );
};
