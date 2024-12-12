'use client';

import Script from 'next/script';
import { useEffect } from 'react';

import useAdSenseClient from './useAdSenseClient';

export const InterSectionAdSlot = () => {
  const pubId = useAdSenseClient();

  useEffect(() => {
    if (window) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  if (!pubId) {
    return 'AdSense Client ID is not set';
  }

  return (
    <div className='rounded-xl bg-zinc-800/50 p-2 my-8 h-32 max-h-32 w-full min-w-64 text-sm text-zinc-400'>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
        crossOrigin='anonymous'
      />
      <ins
        className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client={pubId}
        data-ad-slot='4995642586'
        data-ad-format='auto'
        data-full-width-responsive='true'
      ></ins>
    </div>
  );
};

export const SideRailAdSlot = () => {
  const pubId = useAdSenseClient();

  useEffect(() => {
    if (window) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  if (!pubId) {
    return 'AdSense Client ID is not set';
  }

  return (
    <ins
      className='adsbygoogle'
      style={{ display: 'block' }}
      data-ad-client={pubId}
      data-ad-slot='4046918224'
      data-ad-format='auto'
      data-full-width-responsive='true'
    ></ins>
  );
};
