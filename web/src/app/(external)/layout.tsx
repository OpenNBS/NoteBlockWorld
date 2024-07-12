import '@web/src/app/globals.css';
import '@web/src/app/enableRecaptchaBadge.css';
import '@web/src/app/hideScrollbar.css';

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        className="fixed z-[-1] w-full h-full bg-center bg-repeat grayscale-[50%] before:content-[''] before:absolute before:w-full before:h-full before:bg-gradient-to-b before:from-black/20 before:to-black/90"
        style={{
          backgroundImage: "url('/background-tile-flat.png')",
        }}
      ></div>
      {children}
    </>
  );
}
