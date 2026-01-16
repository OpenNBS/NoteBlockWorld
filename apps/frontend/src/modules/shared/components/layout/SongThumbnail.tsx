import Image from 'next/image';

// For the fallback image, see: https://stackoverflow.com/a/77280293/9045426

const SongThumbnail = ({
  src,
  fallbackSrc = '/demo.png',
}: {
  src: string;
  fallbackSrc?: string;
}) => {
  // TODO:Check if the image is from localhost to avoid Next.js 15 private IP errors
  // Next.js 15 blocks images from private IPs (localhost, 127.0.0.1, ::1) for security reasons.
  // This is related to CVE-2025-55173 security vulnerability.
  // Sources:
  // - https://nextjs.org/blog/next-15 (Next.js 15 release notes)
  // - https://advisories.gitlab.com/pkg/npm/next/CVE-2025-55173/ (Security advisory)
  // - https://github.com/vercel/next.js/discussions/50617 (GitHub discussion)
  // - https://learnspace.blog/blog/the-right-way-to-handle-images-in-next-js-15
  // Workaround: Use unoptimized={true} for localhost images to bypass the optimization API
  // which triggers the private IP check. This only affects development; production images
  // from external sources will still be optimized.
  const isLocalhost =
    src.startsWith('http://localhost') ||
    src.startsWith('http://127.0.0.1') ||
    src.startsWith('http://[::1]');

  return (
    <Image
      unoptimized={isLocalhost} // Disable optimization for localhost to avoid private IP errors
      src={src}
      className='w-full h-full rounded-lg aspect-5/3 object-cover'
      width={640}
      height={384}
      alt=''
      onError={(e) => {
        e.currentTarget.id = fallbackSrc;
        e.currentTarget.srcset = fallbackSrc;
      }}
    />
  );
};

export default SongThumbnail;
