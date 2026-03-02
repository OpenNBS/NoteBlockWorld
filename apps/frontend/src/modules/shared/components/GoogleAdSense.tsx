const GoogleAdSense = ({ pId }: { pId?: string }) => {
  if (process.env.NODE_ENV !== 'production' || !pId) {
    return null;
  }

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
      crossOrigin='anonymous'
    />
  );
};

export default GoogleAdSense;
