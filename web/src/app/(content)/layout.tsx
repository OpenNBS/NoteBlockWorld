import '@web/src/app/globals.css';

import NavbarLayout from '@web/src/server/components/Layout/Layout';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    return (
      <html lang='en' className='h-full min:h-screen'>
        <body className='h-full min:h-screen'>
          <NavbarLayout>{children}</NavbarLayout>
        </body>
      </html>
    );
  } catch (e) {
    return (
      <html lang='en' className='h-full min:h-screen'>
        <body className='h-full min:h-screen'>
          <NavbarLayout>{children}</NavbarLayout>
        </body>
      </html>
    );
  }
}
