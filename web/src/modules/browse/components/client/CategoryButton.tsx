'use client';

import { UploadConst } from '@shared/validation/song/constants';
import { CategoryType } from '@shared/validation/song/dto/types';

import { useRecentSongsProvider } from './context/RecentSongs.context';

type CategoryButtonProps = {
  children: React.ReactNode;
  isActive: boolean;
  isDisabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  id: string;
};

export const CategoryButtonGroup = () => {
  const { categories, setSelectedCategory, selectedCategory } =
    useRecentSongsProvider();

  return (
    <div className='flex w-fit gap-2 md:gap-3 overflow-x-auto'>
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
            {UploadConst.categories[category as CategoryType]}
            <span className='text-sm text-zinc-400 ml-1 font-bold'>
              {count}
            </span>
          </CategoryButton>
        );
      })}
    </div>
  );
};

export const CategoryButton = ({
  isActive,
  isDisabled,
  onClick,
  children,
  id,
}: CategoryButtonProps) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className={
        (isActive
          ? 'bg-white text-black cursor-pointer font-bold'
          : 'bg-zinc-600 enabled:text-white hover:bg-zinc-500 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:opacity-50') +
        ' whitespace-nowrap text-sm py-1 px-2 min-w-fit w-24 rounded-full transition-all duration-200'
      }
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};
