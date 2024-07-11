import Link from 'next/link';

import { cn } from '@web/src/lib/tailwind.utils';

export const CopyrightFooter = ({ className }: { className?: string }) => (
  <p className={cn('mx-auto text-zinc-600 text-xs', className)}>
    © 2024{' '}
    <Link href='https://opennbs.org/' className='hover:underline'>
      OpenNBS
    </Link>
  </p>
);
