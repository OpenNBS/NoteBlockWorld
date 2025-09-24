'use client';
import { UPLOAD_CONSTANTS } from '@nbw/config';
import type { CategoryType } from '@nbw/database';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNextSmall,
  CarouselPreviousSmall
} from '@web/modules/shared/components/client/Carousel';

import { useRecentSongsProvider } from './context/RecentSongs.context';

type CategoryButtonProps = {
  children   : React.ReactNode;
  isActive   : boolean;
  isDisabled?: boolean;
  onClick    : (e: React.MouseEvent<HTMLButtonElement>) => void;
  id         : string;
};

export const CategoryButtonGroup = () => {
  const { categories, setSelectedCategory, selectedCategory } =
    useRecentSongsProvider();

  return (
    <Carousel
      className='w-fit max-w-full'
      opts={{
        align         : 'start',
        loop          : false,
        duration      : 10,
        slidesToScroll: 2,
        dragFree      : true
      }}
      orientation='horizontal'
    >
      <CarouselContent className='flex gap-2'>
        {Object.entries(categories).map(([category, count]) => {
          return (
            <CategoryButton
              key={category}
              id={category}
              data-test={`category-${category}`}
              isActive={selectedCategory === category}
              onClick={() => {
                if (selectedCategory === category) {
                  setSelectedCategory('');
                } else {
                  setSelectedCategory(category);
                }
              }}
            >
              {UPLOAD_CONSTANTS.categories[category as CategoryType]}
              <span className='text-sm text-zinc-400 ml-1 font-bold'>
                {count}
              </span>
            </CategoryButton>
          );
        })}
      </CarouselContent>
      <CarouselPreviousSmall />
      <CarouselNextSmall />
    </Carousel>
  );
};

export const CategoryButton = ({
  isActive,
  isDisabled,
  onClick,
  children,
  id
}: CategoryButtonProps) => {
  return (
    <CarouselItem>
      <button
        id={id}
        onClick={onClick}
        className={
          (isActive
            ? 'bg-white text-black cursor-pointer font-bold'
            : 'bg-zinc-600 enabled:text-white hover:bg-zinc-500 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:opacity-50') +
          ' mr-1 whitespace-nowrap text-sm py-1 px-2 w-fit min-w-24 rounded-full transition-all duration-200'
        }
        disabled={isDisabled}
      >
        {children}
      </button>
    </CarouselItem>
  );
};
