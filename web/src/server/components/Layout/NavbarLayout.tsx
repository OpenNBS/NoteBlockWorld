import { Footer } from './Footer';
import { Header } from './Header';
type TNavbarLayoutProps = {
  children: React.ReactNode;
};

async function Layout({ children }: TNavbarLayoutProps) {
  return (
    <div
      className='w-full h-full flex flex-col justify-between items-center bg-zinc-900'
      style={{
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Header />
      {/* Main content */}
      <main className='pt-24 px-6 sm:px-10 pb-10'>{children}</main>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Layout;
