import '@web/src/app/globals.css';
import Layout from '@web/src/server/components/Layout/Layout';

export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
