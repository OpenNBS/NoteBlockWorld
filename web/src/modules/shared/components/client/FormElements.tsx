import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import Markdown from 'react-markdown';

import { cn } from '@web/src/lib/tailwind.utils';
import { ErrorBalloon } from '@web/src/modules/shared/components/client/ErrorBalloon';

import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';

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
  tooltip,
  isLoading,
  className,
  children,
}: {
  label?: string;
  tooltip?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      {label && <Label label={label} />}
      {tooltip && <InfoTooltip>{tooltip}</InfoTooltip>}
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

const InfoTooltip = ({ children }: { children: React.ReactNode }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type='button'
          className='float-right relative top-0.5 text-zinc-500 cursor-default'
        >
          <FontAwesomeIcon icon={faQuestionCircle} />
        </button>
      </TooltipTrigger>
      <TooltipContent className='max-w-64 px-2.5 py-2 flex flex-col gap-2 [&_a]:text-blue-400 [&_a:hover]:text-blue-300'>
        {children}
      </TooltipContent>
    </Tooltip>
  );
};

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    id: string;
    label: string;
    tooltip?: React.ReactNode;
    description?: string;
    isLoading?: boolean;
    errorMessage?: string;
  }
>((props, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, label, isLoading, errorMessage, ...rest } = props;

  return (
    <>
      {/* TODO: make this into a composable component: <Input.Description>, <Input.Label> etc. */}
      <Label id={id} label={label} />
      {props.tooltip && <InfoTooltip>{props.tooltip}</InfoTooltip>}
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
      {props.description && (
        <p className='block text-sm text-zinc-500'>{props.description}</p>
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
    tooltip?: React.ReactNode;
    isLoading?: boolean;
    errorMessage?: string;
  }
>((props, ref) => {
  const { id, label, isLoading, errorMessage, tooltip, ...rest } = props;

  return (
    <>
      <Label id={id} label={label} />
      {tooltip && <InfoTooltip>{tooltip}</InfoTooltip>}
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
    tooltip?: React.ReactNode;
    isLoading?: boolean;
    errorMessage?: string;
    description?: string;
  }
>((props, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, label, isLoading, errorMessage, description, ...rest } = props;

  return (
    <>
      {label && <Label id={id} label={label} />}
      {props.tooltip && <InfoTooltip>{props.tooltip}</InfoTooltip>}
      {isLoading ? (
        <Skeleton height='3rem' containerClassName='block leading-none' />
      ) : (
        <select
          ref={ref}
          {...rest}
          className={cn(
            `block h-12 w-full rounded-lg bg-transparent border-2 ${
              errorMessage
                ? 'border-red-500 focus:outline-red-500'
                : 'border-zinc-500'
            }  disabled:border-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-500 p-2`,
            props.className,
          )}
        />
      )}
      {description && (
        <p className='block text-sm text-zinc-500 leading-tight pt-1 [&_a]:text-blue-400 [&_a:hover]:text-blue-300'>
          <Markdown>{description}</Markdown>
        </p>
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
    tooltip?: React.ReactNode;
  }
>((props, ref) => {
  const { errorMessage, tooltip, ...rest } = props;

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
      {tooltip && <InfoTooltip>{tooltip}</InfoTooltip>}
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

export const UploadButton = ({ isDisabled }: { isDisabled: boolean }) => {
  return (
    <div
      className={cn(
        'transform motion-reduce:transform-none transition duration-150 ease-in-back',
        isDisabled
          ? ''
          : 'hover:scale-[115%] hover:rotate-6 active:scale-[85%] active:rotate-6',
      )}
    >
      <button
        type='submit'
        disabled={isDisabled}
        className='w-32 p-3 enabled:hover:animate-[shake_0.25s_linear_infinite] motion-reduce:animate-none rounded-lg text-white py-3 px-6 uppercase font-bold transition duration-150 bg-green-600 enabled:hover:bg-green-500 active:bg-green-700 disabled:opacity-50'
      >
        Upload
      </button>
    </div>
  );
};

export const EditButton = ({ isDisabled }: { isDisabled: boolean }) => {
  return (
    <button
      type='submit'
      disabled={isDisabled}
      className='w-32 p-3 rounded-lg text-white py-3 px-6 uppercase font-bold transition duration-150 bg-blue-600 enabled:hover:bg-blue-500 disabled:opacity-50'
    >
      Save
    </button>
  );
};

export const SubmitButton = ({ isDisabled }: { isDisabled: boolean }) => {
  return (
    <button
      type='submit'
      disabled={isDisabled}
      className='w-32 p-3 rounded-lg text-white py-3 px-6 uppercase font-bold transition duration-150 bg-blue-600 enabled:hover:bg-blue-500 disabled:opacity-50'
    >
      Submit
    </button>
  );
};

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isDisabled?: boolean;
  }
>((props, ref) => {
  const { isDisabled, ...rest } = props;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      {...rest}
      className='w-32 p-3 rounded-lg text-white py-3 px-6 uppercase font-bold transition duration-150 bg-blue-600 enabled:hover:bg-blue-500 disabled:opacity-50'
    />
  );
});
Button.displayName = 'Button';
