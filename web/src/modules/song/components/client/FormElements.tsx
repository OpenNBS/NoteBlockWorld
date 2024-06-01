import { forwardRef } from 'react';

import { cn } from '@web/src/lib/tailwind.utils';
import { ErrorBalloon } from '@web/src/modules/shared/components/client/ErrorBalloon';

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    errorMessage?: string;
  }
>((props, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { errorMessage, ...rest } = props;
  return (
    <>
      <input
        ref={ref}
        {...rest}
        className={`block h-12 w-full rounded-lg bg-transparent border-2 ${
          errorMessage ? 'border-red-500' : 'border-zinc-500'
        } disabled:border-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500 p-2`}
      />
      <ErrorBalloon message={errorMessage} isVisible={!!errorMessage} />
    </>
  );
});
Input.displayName = 'Input';

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  React.InputHTMLAttributes<HTMLTextAreaElement> & {
    errorMessage?: string;
  }
>((props, ref) => {
  const { errorMessage, ...rest } = props;
  return (
    <>
      <textarea
        id='description'
        className={`block h-48 w-full rounded-lg bg-transparent border-2 ${
          errorMessage ? 'border-red-500' : 'border-zinc-500'
        } p-2`}
        ref={ref}
        {...rest}
      />
      <ErrorBalloon message={errorMessage} isVisible={!!errorMessage} />
    </>
  );
});
TextArea.displayName = 'TextArea';

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    errorMessage?: string;
  }
>((props, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { errorMessage, ...rest } = props;
  return (
    <>
      <select
        ref={ref}
        {...rest}
        className={cn(
          `block h-12 w-full rounded-lg bg-transparent border-2 ${
            errorMessage ? 'border-red-500' : 'border-zinc-500'
          }  disabled:border-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500 p-2`,
          props.className,
        )}
      />

      <ErrorBalloon message={errorMessage} isVisible={!!errorMessage} />
    </>
  );
});
Select.displayName = 'Select';

export const Checkbox = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    errorMessage?: string;
  }
>((props, ref) => {
  const { errorMessage, ...rest } = props;
  return (
    <>
      <input
        type='checkbox'
        ref={ref}
        {...rest}
        className={`block h-12 w-full rounded-lg bg-transparent border-2 ${
          errorMessage ? 'border-red-500' : 'border-zinc-500'
        } p-2`}
      />
      <ErrorBalloon message={errorMessage} isVisible={!!errorMessage} />
    </>
  );
});
Checkbox.displayName = 'Checkbox';

export const Option = forwardRef<
  HTMLOptionElement,
  React.OptionHTMLAttributes<HTMLOptionElement>
>((props, ref) => {
  return <option ref={ref} {...props} className={`bg-zinc-900`} />;
});
Option.displayName = 'Option';
