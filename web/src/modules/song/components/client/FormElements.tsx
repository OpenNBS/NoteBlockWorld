import { forwardRef } from 'react';

import { cn } from '@web/src/lib/tailwind.utils';
import { ErrorBalloon } from '@web/src/modules/shared/components/client/ErrorBalloon';

export const Area = ({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      {label && <label>{label}</label>}
      <div className='flex justify-center w-full rounded-lg border-2 border-zinc-500 p-8 mb-4'>
        {children}
      </div>
    </>
  );
};

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    id: string;
    label?: string;
    errorMessage?: string;
  }
>((props, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, label, errorMessage, ...rest } = props;
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        ref={ref}
        {...rest}
        className={`block h-12 w-full rounded-lg bg-transparent border-2 ${
          errorMessage ? 'border-red-500' : 'border-zinc-500'
        } disabled:border-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500 p-2`}
      />
      <ErrorBalloon message={errorMessage} />
    </>
  );
});
Input.displayName = 'Input';

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  React.InputHTMLAttributes<HTMLTextAreaElement> & {
    id: string;
    label?: string;
    errorMessage?: string;
  }
>((props, ref) => {
  const { id, label, errorMessage, ...rest } = props;
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <textarea
        id={id}
        className={`block h-48 w-full rounded-lg bg-transparent border-2 ${
          errorMessage ? 'border-red-500' : 'border-zinc-500'
        } disabled:border-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500 p-2`}
        ref={ref}
        {...rest}
      />
      <ErrorBalloon message={errorMessage} />
    </>
  );
});
TextArea.displayName = 'TextArea';

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    id: string;
    label?: string;
    errorMessage?: string;
  }
>((props, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, label, errorMessage, ...rest } = props;
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
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

      <ErrorBalloon message={errorMessage} />
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
        className={`accent-blue scale-150 mr-3 ${
          errorMessage ? 'border-red-500' : 'border-zinc-500'
        } p-2`}
      />
      <ErrorBalloon message={errorMessage} />
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
