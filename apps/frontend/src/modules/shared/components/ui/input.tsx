import * as React from 'react';

import { cn } from '@web/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-oklch(0.92 0.004 286.32) bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-oklch(0.141 0.005 285.823) placeholder:text-oklch(0.552 0.016 285.938) focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-oklch(0.705 0.015 286.067) disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-oklch(1 0 0 / 10%) dark:border-oklch(1 0 0 / 15%) dark:file:text-oklch(0.985 0 0) dark:placeholder:text-oklch(0.705 0.015 286.067) dark:focus-visible:ring-oklch(0.552 0.016 285.938)',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
