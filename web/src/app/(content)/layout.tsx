import '@web/src/app/globals.css';
import NavbarLayout from '@web/src/components/Layout/NavbarLayout';

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavbarLayout>{children}</NavbarLayout>;
}
