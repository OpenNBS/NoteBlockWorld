'use client';

import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@web/lib/utils';

import useAdSenseClient from './useAdSenseClient';

const HideAdButton = ({
  setIsHidden,
}: {
  setIsHidden: (hidden: boolean) => void;
}) => (
  <div className='absolute w-0 h-0 top-full right-3'>
    <button
      className='h-6 w-3'
      onClick={() => {
        setIsHidden(true);
        setTimeout(() => {
          setIsHidden(false);
        }, 1000 * 60 * 5); // Reappears after 5 minutes
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
  adLayoutKey,
  fullWidthResponsive,
  hiddenClassName = 'hidden',
  showCloseButton = true,
}: {
  className: string;
  adSlot: string;
  adFormat: string;
  adLayoutKey?: string;
  fullWidthResponsive?: string;
  hiddenClassName?: string;
  showCloseButton?: boolean;
}) => {
  const pubId = useAdSenseClient();

  const [isHidden, setIsHidden] = useState(false);
  const adRef = useRef<HTMLModElement>(null);
  const [isAdInitialized, setIsAdInitialized] = useState(false);

  // Reset initialization state when ad is hidden/shown
  useEffect(() => {
    if (isHidden) {
      setIsAdInitialized(false);
    }
  }, [isHidden]);

  useEffect(() => {
    if (!pubId || isHidden || isAdInitialized || !adRef.current) {
      return;
    }

    let isInitializing = false;
    let retryCount = 0;
    const maxRetries = 50; // 5 seconds max (50 * 100ms)

    const initializeAd = () => {
      const adElement = adRef.current;
      if (!adElement || isInitializing || isAdInitialized) {
        return;
      }

      // Check if ad is already initialized by AdSense
      const adStatus = adElement.getAttribute('data-adsbygoogle-status');
      if (
        adStatus === 'done' ||
        adStatus === 'filled' ||
        adStatus === 'unfilled'
      ) {
        setIsAdInitialized(true);
        return;
      }

      // Check if the element has dimensions
      const rect = adElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        retryCount++;
        if (retryCount < maxRetries) {
          // Retry after a short delay if element has no dimensions
          setTimeout(initializeAd, 100);
        }
        return;
      }

      // Check if adsbygoogle script is loaded
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        isInitializing = true;
        try {
          // Double-check the element hasn't been initialized by another call
          const currentStatus = adElement.getAttribute(
            'data-adsbygoogle-status',
          );
          if (!currentStatus || currentStatus === '') {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setIsAdInitialized(true);
          } else {
            setIsAdInitialized(true);
          }
        } catch (e) {
          console.error('AdSense initialization error:', e);
          isInitializing = false;
        }
      } else {
        retryCount++;
        if (retryCount < maxRetries) {
          // Wait for script to load
          setTimeout(() => {
            if (typeof window !== 'undefined' && window.adsbygoogle) {
              initializeAd();
            }
          }, 100);
        }
      }
    };

    // Use ResizeObserver to wait for element to have dimensions
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          initializeAd();
          resizeObserver.disconnect();
          break;
        }
      }
    });

    if (adRef.current) {
      resizeObserver.observe(adRef.current);
    }

    // Fallback: try after a delay even if ResizeObserver doesn't fire
    const timeoutId = setTimeout(() => {
      initializeAd();
      resizeObserver.disconnect();
    }, 500);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timeoutId);
      isInitializing = false;
    };
  }, [pubId, isHidden, isAdInitialized]);

  const InfoText = !pubId
    ? () => (
        <p className='text-center my-auto text-xs text-zinc-500 m-4'>
          AdSense Client ID is not set
        </p>
      )
    : () => null;

  return isHidden ? (
    <div className={cn(className, hiddenClassName)}></div>
  ) : (
    <div className={cn(className, isHidden ? hiddenClassName : '')}>
      <InfoText />
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
        crossOrigin='anonymous'
      />
      {!isHidden && (
        <>
          <ins
            ref={adRef}
            className={cn('adsbygoogle', isHidden ? 'hidden' : '')}
            style={{
              display: 'block',
            }}
            data-ad-client={pubId}
            data-ad-slot={adSlot}
            data-ad-format={adFormat}
            data-ad-layout-key={adLayoutKey}
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
      hiddenClassName='hidden!'
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
        'flex-0 sticky mb-8 top-24 max-h-fit hidden xl:block w-36 min-w-36 bg-zinc-800/50 rounded-xl',
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

export const MultiplexAdSlot = ({ className }: { className?: string }) => {
  return (
    <AdTemplate
      className={cn(
        'relative rounded-xl bg-zinc-800/50 my-8 h-auto min-h-32 w-full min-w-64 text-sm text-zinc-400',
        className,
      )}
      adSlot='6673081563'
      adFormat='autorelaxed'
      showCloseButton={true}
    />
  );
};

export const SongCardAdSlot = ({ className }: { className?: string }) => {
  return (
    <AdTemplate
      className={cn(
        'relative rounded-xl bg-zinc-800 p-2 h-full w-full min-w-64 text-sm text-zinc-400',
        className,
      )}
      adSlot='1737918264'
      adFormat='fluid'
      adLayoutKey='-6o+ez-1j-38+bu'
      showCloseButton={false}
    />
  );
};
