import Image from 'next/image';

// See: https://stackoverflow.com/a/77280293/9045426

const SongThumbnail = ({
  src,
  fallbackSrc = '/demo.png'
}: {
  src         : string;
  fallbackSrc?: string;
}) => {
  return (
    <Image
      //unoptimized // TODO: onError is not capturing errors without the 'unoptimized' prop
      src={src}
      className='w-full h-full rounded-lg aspect-[5/3] object-cover'
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
