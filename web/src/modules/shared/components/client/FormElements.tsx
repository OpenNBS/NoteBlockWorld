import * as SliderPrimitive from '@radix-ui/react-slider';
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
import Skeleton from 'react-loading-skeleton';

import { cn } from '@web/src/lib/tailwind.utils';
import { ErrorBalloon } from '@web/src/modules/shared/components/client/ErrorBalloon';

export const Label = forwardRef<
  HTMLLabelElement,
  React.InputHTMLAttributes<HTMLLabelElement> & {
    id?: string;
    label: string;
  }
>((props, ref) => {
  const { id, label } = props;

  return (
    <label htmlFor={id} ref={ref} className='text-sm text-zinc-300'>
      {label}
    </label>
  );
});
Label.displayName = 'Label';

export const Area = ({
  label,
  isLoading,
  className,
  children,
}: {
  label?: string;
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      {label && <Label label={label} />}
      {isLoading ? (
        <Skeleton height='20rem' />
      ) : (
        <div
          className={cn(
            'flex justify-center w-full rounded-lg outline-none border-2 border-zinc-500 p-8 mb-4',
            className,
          )}
        >
          {children}
        </div>
      )}
    </>
  );
};

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    id: string;
    label: string;
    isLoading?: boolean;
    errorMessage?: string;
  }
>((props, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, label, isLoading, errorMessage, ...rest } = props;

  return (
    <>
      <Label id={id} label={label} />
      {isLoading ? (
        <Skeleton height='3rem' containerClassName='block leading-none' />
      ) : (
        <input
          type='text'
          id={id}
          ref={ref}
          {...rest}
          className={`block h-12 w-full rounded-lg bg-transparent border-2 ${
            errorMessage ? 'border-red-500' : 'border-zinc-500'
          } disabled:border-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500 p-2`}
        />
      )}
      <ErrorBalloon message={errorMessage} />
    </>
  );
});
Input.displayName = 'Input';

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  React.InputHTMLAttributes<HTMLTextAreaElement> & {
    id: string;
    label: string;
    isLoading?: boolean;
    errorMessage?: string;
  }
>((props, ref) => {
  const { id, label, isLoading, errorMessage, ...rest } = props;

  return (
    <>
      <Label id={id} label={label} />
      {isLoading ? (
        <Skeleton height='12rem' containerClassName='block leading-none' />
      ) : (
        <textarea
          id={id}
          className={`block h-48 w-full rounded-lg bg-transparent border-2 ${
            errorMessage ? 'border-red-500' : 'border-zinc-500'
          } disabled:border-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500 p-2`}
          ref={ref}
          {...rest}
        />
      )}
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
    isLoading?: boolean;
    errorMessage?: string;
  }
>((props, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, label, isLoading, errorMessage, ...rest } = props;

  return (
    <>
      {label && <Label id={id} label={label} />}
      {isLoading ? (
        <Skeleton height='3rem' containerClassName='block leading-none' />
      ) : (
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
      )}

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

export const Slider = forwardRef<
  ElementRef<typeof SliderPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className='relative h-2 w-full grow overflow-hidden rounded-full bg-secondary'>
      <SliderPrimitive.Range className='absolute h-full bg-primary' />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className='block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50' />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;
