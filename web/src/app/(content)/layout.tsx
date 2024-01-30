import '@web/src/app/globals.css';
import NavbarLayout from '@web/src/server/components/layout/NavbarLayout';

export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavbarLayout>{children}</NavbarLayout>;
}
