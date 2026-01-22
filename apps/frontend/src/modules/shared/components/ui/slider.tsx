'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '@web/lib/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'group relative flex w-full touch-none select-none items-center transition-colors',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className='relative h-2 w-full grow overflow-hidden rounded-full bg-zinc-600'>
      <SliderPrimitive.Range className='absolute h-full bg-blue-500 group-hover:bg-blue-600 group-active:bg-blue-400' />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className='block h-4 w-4 rounded-full bg-blue-500 group-hover:bg-blue-600 group-active:bg-blue-400 shadow focus-visible:outline-hidden focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50' />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
