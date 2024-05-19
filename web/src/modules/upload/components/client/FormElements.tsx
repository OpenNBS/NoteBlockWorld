import { forwardRef } from 'react';

import { cn } from '@web/src/lib/tailwind.utils';

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={`block h-12 w-full rounded-lg bg-transparent border-2 border-zinc-500 disabled:border-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500 p-2`}
    />
  );
});
Input.displayName = 'Input';

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>((props, ref) => {
  return (
    <select
      ref={ref}
      {...props}
      className={cn(
        `block h-12 w-full rounded-lg bg-transparent border-2 border-zinc-500 disabled:border-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500 p-2`,
        props.className,
      )}
    />
  );
});
Select.displayName = 'Select';

export const Option = forwardRef<
  HTMLOptionElement,
  React.OptionHTMLAttributes<HTMLOptionElement>
>((props, ref) => {
  return <option ref={ref} {...props} className={`bg-zinc-900`} />;
});
Option.displayName = 'Option';
