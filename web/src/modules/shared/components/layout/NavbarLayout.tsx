import { Footer } from './Footer';
import { Header } from './Header';
import { CookieBanner } from '../client/CookieBanner';
import { SideRailAdSlot } from '../client/ads/AdSlots';

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
        <div className='flex flex-row justify-around w-full pt-24'>
          <SideRailAdSlot />
          <main className='flex-1 w-full max-w-screen-lg px-6 sm:px-10 pb-10'>
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
