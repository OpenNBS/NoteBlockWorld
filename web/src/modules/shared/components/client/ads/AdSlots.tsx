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
    <ins
      className='adsbygoogle'
      style={{ display: 'block' }}
      data-ad-client={pubId}
      data-ad-slot='4995642586'
      data-ad-format='auto'
      data-full-width-responsive='true'
    ></ins>
  );
};
