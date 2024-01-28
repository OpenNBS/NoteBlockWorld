'use client';

import styled from 'styled-components';
import { TimespanButton } from '../../../client/components/Song/TimespanButton';

export const TimespanButtonGroup = () => {
  return (
    <div className='flex flex-row gap-2 md:gap-3 overflow-x-auto'>
      <TimespanButton
        id='hour'
        isActive={true}
        isDisabled={false}
        onClick={() => {}}
      >
        past hour
      </TimespanButton>
      <TimespanButton
        id='day'
        isActive={false}
        isDisabled={false}
        onClick={() => {}}
      >
        past day
      </TimespanButton>
      <TimespanButton
        id='week'
        isActive={false}
        isDisabled={false}
        onClick={() => {}}
      >
        past week
      </TimespanButton>
      <TimespanButton
        id='month'
        isActive={false}
        isDisabled={false}
        onClick={() => {}}
      >
        past month
      </TimespanButton>
      <TimespanButton
        id='year'
        isActive={false}
        isDisabled={false}
        onClick={() => {}}
      >
        past year
      </TimespanButton>
    </div>
  );
};

export const SongCardGroup = styled.div.attrs({
  className:
    'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full items-center gap-4',
})``;
