import Script from 'next/script';

import useAdSenseClient from './useAdSenseClient';

const AdSlot = ({ children }: { children: React.ReactNode }) => {
  return <div className='rounded-xl bg-zinc-800 p-2 my-4'>{children}</div>;
};

export const InterSectionAdSlot = () => {
  const pubId = useAdSenseClient();

  if (!pubId) {
    return 'AdSense Client ID is not set';
  }

  return (
    <AdSlot>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
        crossOrigin='anonymous'
      />
      <ins
        className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-client={pubId}
        data-ad-slot='4046918224'
        data-ad-format='auto'
        data-full-width-responsive='true'
      ></ins>
      <Script
        id='adsbygoogle-push'
        dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({});`,
        }}
      />
    </AdSlot>
  );
};
