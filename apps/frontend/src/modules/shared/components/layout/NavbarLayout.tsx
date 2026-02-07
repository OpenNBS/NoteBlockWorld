import { SideRailAdSlot } from '../client/ads/AdSlots';
import { CookieBanner } from '../client/CookieBanner';

import { Footer } from './Footer';
import { Header } from './Header';

type TNavbarLayoutProps = {
  children: React.ReactNode;
};

async function Layout({ children }: TNavbarLayoutProps) {
  return (
    <>
      <div className='w-full h-full min-h-screen flex flex-col justify-between items-center bg-zinc-900'>
        {/* Header */}
        <Header />
        {/* Main content */}
        <div className='flex flex-row justify-around w-full pt-24 pb-10'>
          <SideRailAdSlot />
          <main className='flex-1 w-full max-w-(--breakpoint-xl) px-6 sm:px-10 mb-8'>
            {children}
          </main>
          <SideRailAdSlot />
        </div>
        {/* Footer */}
        <Footer />
        <CookieBanner />
      </div>
    </>
  );
}

export default Layout;
