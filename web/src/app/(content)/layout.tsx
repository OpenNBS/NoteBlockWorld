import '@web/src/app/globals.css';

import NavbarLayout from '@web/src/server/components/Layout/Layout';

export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavbarLayout>{children}</NavbarLayout>;
}
