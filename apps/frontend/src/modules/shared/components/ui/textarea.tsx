import * as React from 'react';

import { cn } from '@web/lib/utils';

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[60px] w-full rounded-md border border-oklch(0.92 0.004 286.32) bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-oklch(0.552 0.016 285.938) focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-oklch(0.705 0.015 286.067) disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-oklch(1 0 0 / 10%) dark:border-oklch(1 0 0 / 15%) dark:placeholder:text-oklch(0.705 0.015 286.067) dark:focus-visible:ring-oklch(0.552 0.016 285.938)',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
