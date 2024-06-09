import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import './globals.css';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'react-hot-toast';
import 'react-loading-skeleton/dist/skeleton.css';
import { SkeletonTheme } from 'react-loading-skeleton';

import { TooltipProvider } from '../modules/shared/components/tooltip';

const lato = Lato({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
});

const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReCaptchaProvider useEnterprise>
      <html lang='en'>
        <body
          className={lato.className + ' bg-zinc-900 text-white overflow-hidden'}
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
              className: '!bg-zinc-700 !text-white',
              duration: 4000,
            }}
          />
          <SkeletonTheme
            borderRadius='10px'
            baseColor='rgb(39 39 42)'
            highlightColor='rgb(63 63 70)'
          >
            <TooltipProvider delayDuration={0} skipDelayDuration={0}>
              {children}
            </TooltipProvider>
          </SkeletonTheme>
        </body>
      </html>
    </ReCaptchaProvider>
  );
}
