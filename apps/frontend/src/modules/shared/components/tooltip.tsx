'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { ReactNode, forwardRef } from 'react';

import { cn } from '@web/src/lib/tailwind.utils';

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipArrow = forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <>
    <TooltipPrimitive.Arrow
      ref={ref}
      className={cn('', className)}
      {...props}
    />
  </>
));

TooltipArrow.displayName = TooltipPrimitive.Content.displayName;

const TooltipContent = forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 2, children, ...props }, ref) => (
  <>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 rounded-md px-3 py-1.5 text-xs text-white bg-zinc-700 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
        className,
      )}
      {...props}
    >
      <TooltipPrimitive.Arrow className='fill-zinc-700' />
      {children}
    </TooltipPrimitive.Content>
  </>
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

function TooltipProvider({
  children,
  ...props
}: TooltipPrimitive.TooltipProviderProps & { children: ReactNode }) {
  return (
    <TooltipPrimitive.Provider {...props}>{children}</TooltipPrimitive.Provider>
  );
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
};
