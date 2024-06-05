'use client';

import { useFeaturedSongsProvider } from './context/FeaturedSongs.context';

interface TimespanButtonProps {
  children: React.ReactNode;
  isActive: boolean;
  isDisabled: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  id: string;
}

export const TimespanButtonGroup = () => {
  const { setTimespan, timespan } = useFeaturedSongsProvider();
  return (
    <div className='flex flex-row gap-2 md:gap-3 overflow-x-auto'>
      <TimespanButton
        id='hour'
        data-test='timespan-hour'
        isActive={timespan === 'hour'}
        isDisabled={timespan === 'hour'}
        onClick={() => setTimespan('hour')}
      >
        past hour
      </TimespanButton>
      <TimespanButton
        id='day'
        data-test='timespan-day'
        isActive={timespan === 'day'}
        isDisabled={timespan === 'day'}
        onClick={() => setTimespan('day')}
      >
        past day
      </TimespanButton>
      <TimespanButton
        id='week'
        data-test='timespan-week'
        isActive={timespan === 'week'}
        isDisabled={timespan === 'week'}
        onClick={() => setTimespan('week')}
      >
        past week
      </TimespanButton>
      <TimespanButton
        id='month'
        data-test='timespan-month'
        isActive={timespan === 'month'}
        isDisabled={timespan === 'month'}
        onClick={() => setTimespan('month')}
      >
        past month
      </TimespanButton>
      <TimespanButton
        id='year'
        data-test='timespan-year'
        isActive={timespan === 'year'}
        isDisabled={timespan === 'year'}
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
    <div>
      <button
        id={id}
        onClick={onClick}
        className={
          (isActive
            ? 'bg-white text-black cursor-default font-bold'
            : 'enabled:bg-zinc-600 enabled:text-white enabled:cursor-pointer hover:enabled:bg-zinc-500 disabled:bg-zinc-700 disabled:text-zinc-500') +
          ' whitespace-nowrap text-sm py-1 px-2 w-24 rounded-full transition-all duration-200'
        }
        disabled={isDisabled}
      >
        {children}
      </button>
    </div>
  );
};
