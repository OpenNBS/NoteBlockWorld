import { isProductionAppEnv } from '@web/lib/appEnv';

const GoogleAdSense = ({ pId }: { pId?: string }) => {
  if (!isProductionAppEnv() || !pId) {
    return null;
  }

  return (
    // TODO: we changed from Next's Script component to a regular script tag to fix the following error:
    // "AdSense head tag doesn't support `data-nscript` attribute". Check if this can be reverted later.
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
      crossOrigin='anonymous'
    />
  );
};

export default GoogleAdSense;
