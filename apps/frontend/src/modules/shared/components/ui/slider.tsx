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
      'group relative flex touch-none select-none items-center transition-colors',
      'data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row',
      'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:justify-center',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className='relative grow overflow-hidden rounded-full bg-zinc-600 data-[orientation=horizontal]:h-1 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1'>
      <SliderPrimitive.Range className='absolute bg-blue-500 group-hover:bg-blue-400 data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full' />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className='block h-3 w-3 rounded-full bg-white opacity-0 shadow group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:outline-hidden focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50' />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
