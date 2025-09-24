const DetectAdBlock = () => {
  return (
    <>
      <script src='/adasync.js' />
      <script
        id='detect-ad-block'
        dangerouslySetInnerHTML={{
          __html: `
          if (document.getElementById('F4uONjE2hMik')) {
            window.isBlockingAds = false;
            F4uONjE2hMik = 'No';
          } else {
            window.isBlockingAds = true;
            F4uONjE2hMik = 'Yes';
          }
          
          if(typeof gtag === 'function'){
            gtag('event', 'blocking_ads', { 'event_category': 'Blocking Ads', 'event_label': F4uONjE2hMik, 'non_interaction': true });
          }
        `,
        }}
      ></script>
    </>
  );
};

export default DetectAdBlock;
