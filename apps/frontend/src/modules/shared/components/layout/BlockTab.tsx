import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { cn } from '@web/lib/utils';

import { MusicalNote } from './MusicalNote';

type BlockTabColor = 'purple' | 'blue' | 'green' | 'cyan' | 'zinc';

const colorConfig: Record<
  BlockTabColor,
  { bg: string; afterBg: string; beforeBg: string }
> = {
  purple: {
    bg: 'bg-purple-700',
    afterBg: 'rgb(88 28 135)', // purple-900
    beforeBg: 'rgb(59 7 100)', // purple-950
  },
  blue: {
    bg: 'bg-blue-700',
    afterBg: 'rgb(30 58 138)', // blue-900
    beforeBg: 'rgb(23 37 84)', // blue-950
  },
  green: {
    bg: 'bg-green-700',
    afterBg: 'rgb(20 83 45)', // green-900
    beforeBg: 'rgb(5 46 22)', // green-950
  },
  cyan: {
    bg: 'bg-cyan-700',
    afterBg: 'rgb(22 78 99)', // cyan-900
    beforeBg: 'rgb(8 51 68)', // cyan-950
  },
  zinc: {
    bg: 'bg-zinc-600',
    afterBg: 'rgb(63 63 70)', // zinc-800
    beforeBg: 'rgb(24 24 27)', // zinc-900
  },
};

export const BlockTab = ({
  href,
  icon,
  label,
  color = 'zinc',
}: {
  href: string;
  icon: IconDefinition;
  label: string;
  color?: BlockTabColor;
}) => {
  const colors = colorConfig[color];

  return (
    <Link
      href={href}
      className={cn(
        'bevel p-2 flex-1 w-8 lg:w-20 max-w-28 flex items-center justify-center gap-2 translate-y-[11px] hover:translate-y-1.5 transition-all duration-150 hover:brightness-125',
        colors.bg,
      )}
      style={
        {
          '--bevel-after-bg': colors.afterBg,
          '--bevel-before-bg': colors.beforeBg,
        } as React.CSSProperties
      }
    >
      <FontAwesomeIcon icon={icon} />
      <span className='hidden lg:block'>{label}</span>
      <MusicalNote />
    </Link>
  );
};
