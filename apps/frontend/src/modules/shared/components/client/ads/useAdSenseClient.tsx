import { useMemo } from 'react';

import { isProductionAppEnv } from '@web/lib/appEnv';

const useAdSenseClient = () => {
  const pubId = useMemo(() => {
    if (!isProductionAppEnv()) {
      return null;
    }

    return process.env.NEXT_PUBLIC_ADSENSE_CLIENT || null;
  }, []);

  return pubId;
};

export default useAdSenseClient;
