'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@web/src/modules/shared/components/tooltip';

import { useFeaturedSongsProvider } from './context/FeaturedSongs.context';

interface TimespanButtonProps {
  children: React.ReactNode;
  isActive: boolean;
  isDisabled: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  id: string;
}

export const TimespanButtonGroup = () => {
  const { setTimespan, timespan, timespanEmpty } = useFeaturedSongsProvider();

  return (
    <div className='flex flex-row gap-2 md:gap-3 overflow-x-auto'>
      <TimespanButton
        id='hour'
        data-test='timespan-hour'
        isActive={timespan === 'hour'}
        isDisabled={timespan === 'hour' || timespanEmpty['hour']}
        onClick={() => setTimespan('hour')}
      >
        past hour
      </TimespanButton>
      <TimespanButton
        id='day'
        data-test='timespan-day'
        isActive={timespan === 'day'}
        isDisabled={timespan === 'day' || timespanEmpty['day']}
        onClick={() => setTimespan('day')}
      >
        past day
      </TimespanButton>
      <TimespanButton
        id='week'
        data-test='timespan-week'
        isActive={timespan === 'week'}
        isDisabled={timespan === 'week' || timespanEmpty['week']}
        onClick={() => setTimespan('week')}
      >
        past week
      </TimespanButton>
      <TimespanButton
        id='month'
        data-test='timespan-month'
        isActive={timespan === 'month'}
        isDisabled={timespan === 'month' || timespanEmpty['month']}
        onClick={() => setTimespan('month')}
      >
        past month
      </TimespanButton>
      <TimespanButton
        id='year'
        data-test='timespan-year'
        isActive={timespan === 'year'}
        isDisabled={timespan === 'year' || timespanEmpty['year']}
        onClick={() => setTimespan('year')}
      >
        past year
      </TimespanButton>
    </div>
  );
};

export const TimespanButton = ({
  isActive,
  isDisabled,
  onClick,
  children,
  id,
}: TimespanButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <button
          id={id}
          onClick={onClick}
          className={
            (isActive
              ? 'bg-white text-black cursor-default font-bold'
              : 'bg-zinc-600 enabled:text-white enabled:cursor-pointer hover:enabled:bg-zinc-500 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:opacity-50') +
            ' whitespace-nowrap text-sm py-1 px-2 w-24 rounded-full transition-all duration-200'
          }
          disabled={isDisabled}
        >
          {children}
        </button>
      </TooltipTrigger>
      {isDisabled && !isActive && (
        <TooltipContent>
          No songs uploaded in the {children?.toString()}
        </TooltipContent>
      )}
    </Tooltip>
  );
};
