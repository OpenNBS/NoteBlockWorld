import { useMemo } from 'react';

const useAdSenseClient = () => {
  const pubId = useMemo(() => {
    if (process.env.NODE_ENV !== 'production') {
      return null;
    }

    return process.env.NEXT_PUBLIC_ADSENSE_CLIENT || null;
  }, []);

  return pubId;
};

export default useAdSenseClient;
