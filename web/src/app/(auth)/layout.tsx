import '@web/src/app/globals.css';
import '@web/src/app/enableRecaptchaBadge.css';

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
