import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { cn } from '@web/src/lib/tailwind.utils';

export const BlockTab = ({
  href,
  icon,
  label,
  className,
}: {
  href: string;
  icon: IconDefinition;
  label: string;
  className?: string;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        'bevel p-2 flex-1 w-8 md:min-w-20 max-w-28 flex items-center justify-center gap-2 bg-zinc-600 after:bg-zinc-800 before:bg-zinc-900 translate-y-[11px] hover:translate-y-1.5 transition-all duration-150 hover:brightness-125',
        className,
      )}
    >
      <FontAwesomeIcon icon={icon} />
      <span className='hidden sm:block'>{label}</span>
    </Link>
  );
};
