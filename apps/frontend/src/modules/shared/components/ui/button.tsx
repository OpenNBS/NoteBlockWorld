import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@web/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-oklch(0.705 0.015 286.067) disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-oklch(0.552 0.016 285.938)',
  {
    variants: {
      variant: {
        default:
          'bg-oklch(0.21 0.006 285.885) text-oklch(0.985 0 0) shadow hover:bg-oklch(0.21 0.006 285.885)/90 dark:bg-oklch(0.92 0.004 286.32) dark:text-oklch(0.21 0.006 285.885) dark:hover:bg-oklch(0.92 0.004 286.32)/90',
        destructive:
          'bg-oklch(0.577 0.245 27.325) text-destructive-foreground shadow-sm hover:bg-oklch(0.577 0.245 27.325)/90 dark:bg-oklch(0.704 0.191 22.216) dark:hover:bg-oklch(0.704 0.191 22.216)/90',
        outline:
          'border border-oklch(0.92 0.004 286.32) bg-oklch(1 0 0) shadow-sm hover:bg-oklch(0.967 0.001 286.375) hover:text-oklch(0.21 0.006 285.885) dark:border-oklch(1 0 0 / 15%) dark:bg-oklch(0.141 0.005 285.823) dark:hover:bg-oklch(0.274 0.006 286.033) dark:hover:text-oklch(0.985 0 0)',
        secondary:
          'bg-oklch(0.967 0.001 286.375) text-oklch(0.21 0.006 285.885) shadow-sm hover:bg-oklch(0.967 0.001 286.375)/80 dark:bg-oklch(0.274 0.006 286.033) dark:text-oklch(0.985 0 0) dark:hover:bg-oklch(0.274 0.006 286.033)/80',
        ghost:
          'hover:bg-oklch(0.967 0.001 286.375) hover:text-oklch(0.21 0.006 285.885) dark:hover:bg-oklch(0.274 0.006 286.033) dark:hover:text-oklch(0.985 0 0)',
        link: 'text-oklch(0.21 0.006 285.885) underline-offset-4 hover:underline dark:text-oklch(0.92 0.004 286.32)',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
