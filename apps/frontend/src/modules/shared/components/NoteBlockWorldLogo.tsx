import Image from 'next/image';

import { cn } from '@web/lib/utils';

export const NoteBlockWorldLogo = ({
  size,
  orientation = 'adaptive',
  glow,
  className,
}: {
  size: number;
  orientation: 'horizontal' | 'vertical' | 'adaptive';
  glow?: boolean;
  className?: string;
}) => {
  let flexConfig, marginConfig;

  if (orientation === 'horizontal') {
    flexConfig = 'flex-row -mr-8';
    marginConfig = 'right-8';
  } else if (orientation === 'vertical') {
    flexConfig = 'flex-col -mb-10';
    marginConfig = 'bottom-10';
  } else {
    flexConfig = 'flex-row sm:flex-col -mr-8 sm:mr-0 sm:-mb-10';
    marginConfig = 'right-8 sm:right-0 sm:bottom-10';
  }

  return (
    <div
      className={cn(
        flexConfig,
        'flex items-center justify-center gap-2 min-w-fit max-w-full',
        glow ? 'animate-[nbw-glow_3s_ease-in-out_infinite]' : '',
        className,
      )}
    >
      <Image
        src='/nbw-color.png'
        quality={75}
        alt='Note Block World logo'
        width={size}
        height={size}
        className='max-w-full max-h-full relative resize-none'
      />
      <Image
        src='/nbw-logo.png'
        width={size * 1.25}
        height={size * 1.25}
        alt=''
        className={cn(marginConfig, 'relative resize-none')}
      />
    </div>
  );
};
