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
  <div className='absolute w-0 h-0 top-full right-[0.75rem]'>
    <button
      className='h-6 w-3'
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
        className='relative text-zinc-500 text-sm'
      />
    </button>
  </div>
);

const AdTemplate = ({
  className,
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = 'true',
  hiddenClassName = 'hidden',
  showCloseButton = true,
}: {
  className: string;
  adSlot: string;
  adFormat: string;
  fullWidthResponsive: string;
  hiddenClassName?: string;
  showCloseButton?: boolean;
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

  return isHidden ? (
    <div className={cn(className, hiddenClassName)}></div>
  ) : (
    <div className={cn(className, isHidden ? hiddenClassName : '')}>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
        crossOrigin='anonymous'
      />
      {!isHidden && (
        <>
          <ins
            className={cn('adsbygoogle', isHidden ? 'hidden' : '')}
            style={{
              display: 'block',
            }}
            data-ad-client={pubId}
            data-ad-slot={adSlot}
            data-ad-format={adFormat}
            data-full-width-responsive={fullWidthResponsive}
          ></ins>
          {showCloseButton && <HideAdButton setIsHidden={setIsHidden} />}
        </>
      )}
    </div>
  );
};

export const InterSectionAdSlot = ({ className }: { className?: string }) => {
  return (
    <AdTemplate
      className={cn(
        'relative rounded-xl bg-zinc-800/50 p-2 my-8 h-32 max-h-32 w-full min-w-64 text-sm text-zinc-400',
        className,
      )}
      adSlot='4046918224'
      adFormat='auto'
      fullWidthResponsive='true'
      hiddenClassName='!hidden'
    />
  );
};

export const SideRailAdSlot = ({ className }: { className?: string }) => {
  return (
    <AdTemplate
      className={cn(
        // Google Ads adds "height: auto !important;" as element-specific style, which makes it occupy
        // the full page height (due to it being inside a flex). We can limit it to the screen's
        // height with this class: "max-h-[calc(100vh-9rem)]", but then the container doesn't fit to
        // the ad content height, always occupying the full viewport height instead. So we use 'max-w-fit'
        // to cap the max height to that of the ad.
        'flex-0 sticky mb-8 top-24 min-h-96 max-h-fit hidden xl:block w-36 min-w-36 bg-zinc-800/50 rounded-xl',
        className,
      )}
      adSlot='4995642586'
      adFormat='auto'
      fullWidthResponsive='true'
      hiddenClassName='invisible'
    />
  );
};

export const DownloadPopupAdSlot = ({ className }: { className?: string }) => {
  return (
    <AdTemplate
      className={cn(
        'relative rounded-xl bg-zinc-800/50 p-2 my-8 h-32 max-h-32 w-full min-w-64 text-sm text-zinc-400',
        className,
      )}
      adSlot='3239923384'
      adFormat='auto'
      fullWidthResponsive='true'
      showCloseButton={false}
    />
  );
};
