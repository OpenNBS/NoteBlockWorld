'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { cn } from '@web/lib/utils';

const GAP_PX = 32;
const PX_PER_SECOND = 32;
const MIN_DURATION_S = 8;
const LEFT_FADE_PX = 8;

export function MarqueeText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [duration, setDuration] = useState(MIN_DURATION_S);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const measure = () => {
      const overflowing = text.scrollWidth - container.clientWidth > 1;
      const prefersReducedMotion = mediaQuery.matches;

      setIsOverflowing(overflowing);
      setReduceMotion(prefersReducedMotion);

      if (overflowing && !prefersReducedMotion) {
        setDuration(
          Math.max(MIN_DURATION_S, (text.scrollWidth + GAP_PX) / PX_PER_SECOND),
        );
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(text);
    mediaQuery.addEventListener('change', measure);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', measure);
    };
  }, [children]);

  const shouldMarquee = isOverflowing && !reduceMotion;

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;

    if (!shouldMarquee || !container || !track) {
      container?.style.setProperty('--marquee-mask-left-alpha', '1');
      return;
    }

    let frame = 0;

    const update = () => {
      const tx = new DOMMatrix(getComputedStyle(track).transform).m41;
      const loopWidth = track.scrollWidth / 2;
      const distFromStart =
        loopWidth > 0 ? Math.min(Math.abs(tx), Math.abs(tx + loopWidth)) : 0;

      container.style.setProperty(
        '--marquee-mask-left-alpha',
        distFromStart < LEFT_FADE_PX ? '1' : '0',
      );
      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [shouldMarquee]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'min-w-0 w-full overflow-hidden',
        isOverflowing && 'marquee-fade',
      )}
      style={
        shouldMarquee
          ? ({ '--marquee-duration': `${duration}s` } as React.CSSProperties)
          : undefined
      }
    >
      <div
        ref={trackRef}
        className={cn(
          'inline-flex w-max max-w-none',
          shouldMarquee && 'animate-marquee hover:paused group-hover:paused',
        )}
      >
        <span
          ref={textRef}
          className={cn('whitespace-nowrap shrink-0', className)}
        >
          {children}
        </span>
        {shouldMarquee ? (
          <>
            <span className='w-8 shrink-0' aria-hidden />
            <span
              aria-hidden
              className={cn('whitespace-nowrap shrink-0', className)}
            >
              {children}
            </span>
            <span className='w-8 shrink-0' aria-hidden />
          </>
        ) : null}
      </div>
    </div>
  );
}
