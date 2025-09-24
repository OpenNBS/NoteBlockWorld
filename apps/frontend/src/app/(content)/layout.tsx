import '@web/app/globals.css';
import NavbarLayout from '@web/modules/shared/components/layout/NavbarLayout';

export default async function ContentLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <NavbarLayout>{children}</NavbarLayout>;
}
