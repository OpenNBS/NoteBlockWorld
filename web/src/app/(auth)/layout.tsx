import './../globals.css';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='h-full'>
      <body className={'h-full'}>{children}</body>
    </html>
  );
}
