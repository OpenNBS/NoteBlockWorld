import { config } from '@fortawesome/fontawesome-svg-core';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import './globals.css';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from 'react-hot-toast';
import 'react-loading-skeleton/dist/skeleton.css';
import { SkeletonTheme } from 'react-loading-skeleton';
import { WebSite, WithContext } from 'schema-dts';

import DetectAdBlock from '../modules/shared/components/client/ads/DetectAdBlock';
import GoogleAdSense from '../modules/shared/components/GoogleAdSense';
import { TooltipProvider } from '../modules/shared/components/tooltip';

// Pre-import FontAwesome CSS to avoid FOUC
// See: https://fontawesome.com/docs/web/use-with/react/use-with#nextjs
import '@fortawesome/fontawesome-svg-core/styles.css';

// Prevent FontAwesome from injecting CSS after initial render
config.autoAddCss = false;

const lato = Lato({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
});

export const metadata: Metadata = {
  title: { template: '%s | Note Block World', default: '' },
  description:
    'Discover, share and listen to note block music from all around the world',
  applicationName: 'Note Block World',
  keywords: ['note block', 'music', 'minecraft', 'nbs', 'note block studio'],
  openGraph: {
    type: 'website',
    images: `${process.env.NEXT_PUBLIC_URL}/nbw-header.png`,
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_URL,
    siteName: 'Note Block World',
  },
};

const jsonLd: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Note Block World',
  url: process.env.NEXT_PUBLIC_URL,
  description:
    'Discover, share and listen to note block music from all around the world',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReCaptchaProvider useEnterprise>
      <html lang='en'>
        <head>
          <GoogleAdSense pId={process.env.NEXT_PUBLIC_ADSENSE_CLIENT} />
          {/* https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld */}
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/icons/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/icons/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/icons/favicon-16x16.png'
          />
          <link rel='manifest' href='/icons/site.webmanifest' />
          <link
            rel='mask-icon'
            href='/icons/safari-pinned-tab.svg'
            color='#3295ff'
          />
          <link rel='shortcut icon' href='/icons/favicon.ico' />
          <meta name='msapplication-TileColor' content='#3295ff' />
          <meta
            name='msapplication-config'
            content='/icons/browserconfig.xml'
          />
          <meta name='theme-color' content='#3295ff' />
        </head>
        <body
          className={`${lato.className} dark bg-zinc-900 text-white h-full`}
        >
          <NextTopLoader
            showSpinner={false}
            crawlSpeed={700}
            speed={700}
            easing='cubic-bezier(0.16, 1, 0.3, 1)' // easeOutExpo
            height={3}
          />
          <Toaster
            position='bottom-center'
            toastOptions={{
              className: 'bg-zinc-700! text-white! max-w-fit!',
              duration: 4000,
            }}
          />
          <SkeletonTheme
            borderRadius='10px'
            baseColor='rgb(39 39 42)'
            highlightColor='rgb(63 63 70)'
          >
            <TooltipProvider delayDuration={0} skipDelayDuration={0}>
              <NuqsAdapter>{children}</NuqsAdapter>
            </TooltipProvider>
          </SkeletonTheme>
          <DetectAdBlock />
        </body>
        {process.env.NODE_ENV === 'production' &&
          process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          )}
      </html>
    </ReCaptchaProvider>
  );
}
