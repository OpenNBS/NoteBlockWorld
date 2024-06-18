import { Footer } from './Footer';
import { Header } from './Header';

type TNavbarLayoutProps = {
  children: React.ReactNode;
};

async function Layout({ children }: TNavbarLayoutProps) {
  return (
    <div className='w-full h-full min-h-screen flex flex-col justify-between items-center bg-zinc-900'>
      {/* Header */}
      <Header />
      {/* Main content */}
      <main className='w-full max-w-screen-xl flex-grow pt-24 px-6 sm:px-10 pb-10'>
        {children}
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Layout;
