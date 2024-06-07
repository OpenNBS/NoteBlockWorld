'use client';

import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react';
import {
  ButtonHTMLAttributes,
  HTMLAttributes,
  KeyboardEventHandler,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { cn } from '../../../../lib/tailwind.utils';

export type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

export const Carousel = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = 'horizontal',
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y',
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const onSelect = useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = useCallback(() => {
      if (api?.canScrollPrev()) {
        api?.scrollPrev();
      } else {
        api?.scrollTo(api.containerNode().children.length - 1);
      }
    }, [api]);

    const scrollNext = useCallback(() => {
      if (api?.canScrollNext()) {
        api?.scrollNext();
      } else {
        api?.scrollTo(0);
      }
    }, [api]);

    const handleKeyDown: KeyboardEventHandler = useCallback(
      (event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on('reInit', onSelect);
      api.on('select', onSelect);

      return () => {
        api?.off('select', onSelect);
      };
    }, [api, onSelect]);
    api?.scrollSnapList();
    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation:
            orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative', className)}
          role='region'
          aria-roledescription='carousel'
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = 'Carousel';

export const CarouselContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className='overflow-hidden p-4 m-[-1rem]'>
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
          className,
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = 'CarouselContent';

export const CarouselItem = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role='group'
      aria-roledescription='slide'
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className,
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = 'CarouselItem';

const CarouselButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'absolute h-12 w-12 rounded-full bg-zinc-800 hover:bg-zinc-700 hover:scale-110 transition-all duration-200 ease-in-out cursor-pointer',
        className,
      )}
      {...props}
    />
  );
});
CarouselButton.displayName = 'CarouselButton';

export const CarouselPrevious = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { orientation, scrollPrev } = useCarousel();

  return (
    <CarouselButton
      ref={ref}
      className={cn(
        orientation === 'horizontal'
          ? '-left-6 top-1/2 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      onClick={scrollPrev}
      {...props}
    >
      <FontAwesomeIcon icon={faChevronLeft} className='h-4 w-4' />
      <span className='sr-only'>Previous slide</span>
    </CarouselButton>
  );
});
CarouselPrevious.displayName = 'CarouselPrevious';

export const CarouselNext = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { orientation, scrollNext } = useCarousel();

  return (
    <CarouselButton
      ref={ref}
      className={cn(
        orientation === 'horizontal'
          ? '-right-6 top-1/2 -translate-y-1/2'
          : 'bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
      onClick={scrollNext}
      {...props}
    >
      <FontAwesomeIcon icon={faChevronRight} className='h-4 w-4' />
      <span className='sr-only'>Next slide</span>
    </CarouselButton>
  );
});
CarouselNext.displayName = 'CarouselNext';

type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};

export const useDotButton = (): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const { api } = useCarousel();

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api],
  );

  const onInit = useCallback(() => {
    if (!api) return;
    setScrollSnaps(api.scrollSnapList());
  }, [api]);

  const onSelect = useCallback(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onInit();
    onSelect();
    api.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
  }, [api, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

export const CarouselDots = () => {
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton();

  return (
    <div className='flex justify-center gap-2 mt-6'>
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          onClick={() => onDotButtonClick(index)}
          className={cn(
            'h-2.5 w-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 ease-in-out',
            index === selectedIndex && 'bg-zinc-700',
          )}
        />
      ))}
    </div>
  );
};
