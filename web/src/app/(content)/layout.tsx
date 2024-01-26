import { useState } from 'react';
import '@web/src/app/globals.css';
import NavbarLayout from '@web/src/components/Layout/NavbarLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='h-full'>
      <body className={'h-full'}>
        <NavbarLayout>{children}</NavbarLayout>
      </body>
    </html>
  );
}
