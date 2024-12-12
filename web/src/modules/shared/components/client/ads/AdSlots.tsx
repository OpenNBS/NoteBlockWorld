'use client';

import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Script from 'next/script';
import { useEffect, useState } from 'react';

import { cn } from '@web/src/lib/tailwind.utils';

import useAdSenseClient from './useAdSenseClient';

const HideAdButton = ({
  setIsHidden,
}: {
  setIsHidden: (hidden: boolean) => void;
}) => (
  <button
    onClick={() => {
      setIsHidden(true),
        setTimeout(() => {
          setIsHidden(false);
        }, 1000 * 60 * 5); // Reappers after 5 minutes
    }}
  >
    <FontAwesomeIcon
      icon={faClose}
      size='sm'
      className='absolute top-full right-0 text-zinc-500'
    />
  </button>
);

const AdTemplate = ({
  className,
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = 'true',
  hiddenClass = 'hidden',
}: {
  className: string;
  adSlot: string;
  adFormat: string;
  fullWidthResponsive: string;
  hiddenClass: string;
}) => {
  const pubId = useAdSenseClient();

  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (window) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  if (!pubId) {
    return 'AdSense Client ID is not set';
  }

  return (
    <div className={cn(className, isHidden ? hiddenClass : '')}>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
        crossOrigin='anonymous'
      />
      <ins
        className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client={pubId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      ></ins>
      <HideAdButton setIsHidden={setIsHidden} />
    </div>
  );
};

export const InterSectionAdSlot = () => {
  return (
    <AdTemplate
      className='relative rounded-xl bg-zinc-800/50 p-2 my-8 h-32 max-h-32 w-full min-w-64 text-sm text-zinc-400'
      adSlot='4046918224'
      adFormat='auto'
      fullWidthResponsive='true'
      hiddenClass='hidden'
    />
  );
};

export const SideRailAdSlot = () => {
  return (
    <AdTemplate
      className='flex-0 sticky mb-10 top-24 h-[calc(100vh-9rem)] hidden xl:block w-36 bg-zinc-800/50 rounded-xl'
      adSlot='4995642586'
      adFormat='auto'
      fullWidthResponsive='true'
      hiddenClass='invisible'
    />
  );
};
