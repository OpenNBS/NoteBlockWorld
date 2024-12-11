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
        <div className='fixed left-0 mx-[2%] top-24 h-[calc(100vh-12rem)] hidden xl:block w-36 bg-zinc-800/50 rounded-xl'>
          <SideRailAdSlot />
        </div>
        <main className='w-full 2xl:max-w-screen-xl max-w-screen-lg pt-24 2xl:px-16 lg:px-28 px-6 sm:px-10 pb-10'>
          {children}
        </main>
        <div className='fixed right-0 mx-[2%] top-24 h-[calc(100vh-12rem)] hidden xl:block w-36 bg-zinc-800/50 rounded-xl'>
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
