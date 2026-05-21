import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import React, { type RefObject } from 'react';

import { cn } from '@web/lib/utils';

const EVENT_TAG = '#summit26';

const containsEventTag = (text: string | undefined) =>
  (text ?? '').toLowerCase().includes(EVENT_TAG);

const isEventSubmission = (
  title: string | undefined,
  description: string | undefined,
) => containsEventTag(title) || containsEventTag(description);

export const EVENT_REGION_TAGS = [
  '[Patched Plateaus]',
  '[Textured Tropics]',
  '[Welded Woodlands]',
] as const;

export type EventRegionTag = (typeof EVENT_REGION_TAGS)[number];

const EVENT_REGIONS: {
  tag: EventRegionTag;
  emoji: string;
  label: string;
  pillClass: string;
}[] = [
  {
    tag: '[Patched Plateaus]',
    emoji: '🌱',
    label: 'Patched Plateaus',
    pillClass:
      'border-green-500/50 bg-green-900/50 text-green-300 enabled:hover:bg-green-900/70',
  },
  {
    tag: '[Textured Tropics]',
    emoji: '🍂',
    label: 'Textured Tropics',
    pillClass:
      'border-amber-500/50 bg-amber-900/50 text-amber-300 enabled:hover:bg-amber-900/70',
  },
  {
    tag: '[Welded Woodlands]',
    emoji: '🏭',
    label: 'Welded Woodlands',
    pillClass:
      'border-blue-500/50 bg-blue-900/50 text-blue-200 enabled:hover:bg-blue-900/70',
  },
];

const findRegionTag = (
  description: string,
): { index: number; tag: EventRegionTag } | null => {
  for (const regionTag of EVENT_REGION_TAGS) {
    const index = description.indexOf(regionTag);
    if (index !== -1) {
      return { index, tag: regionTag };
    }
  }

  return null;
};

const applyRegionTag = (
  description: string,
  tag: EventRegionTag,
  selectionStart: number,
  selectionEnd: number,
): { value: string; cursor: number } => {
  const existing = findRegionTag(description);

  if (existing) {
    const value =
      description.slice(0, existing.index) +
      tag +
      description.slice(existing.index + existing.tag.length);

    return { value, cursor: existing.index + tag.length };
  }

  const value =
    description.slice(0, selectionStart) +
    tag +
    description.slice(selectionEnd);

  return { value, cursor: selectionStart + tag.length };
};

type EventSubmissionInfoProps = {
  title?: string;
  description?: string;
  descriptionRef: RefObject<HTMLTextAreaElement | null>;
  disabled?: boolean;
  onDescriptionChange: (description: string) => void;
};

export const EventSubmissionInfo: React.FC<EventSubmissionInfoProps> = ({
  title,
  description,
  descriptionRef,
  disabled = false,
  onDescriptionChange,
}) => {
  const applyRegion = (tag: EventRegionTag) => {
    if (disabled) {
      return;
    }

    const textarea = descriptionRef.current;
    const current = description ?? '';
    const selectionStart = textarea?.selectionStart ?? current.length;
    const selectionEnd = textarea?.selectionEnd ?? selectionStart;
    const { value, cursor } = applyRegionTag(
      current,
      tag,
      selectionStart,
      selectionEnd,
    );

    if (value === current) {
      return;
    }

    onDescriptionChange(value);

    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(cursor, cursor);
    });
  };
  if (!isEventSubmission(title, description)) {
    return null;
  }

  return (
    <div className='flex gap-2 mt-8 bg-blue-800 border-blue-400 text-blue-300 border-2 rounded-lg px-3 py-2 text-sm'>
      <Image
        className='h-6 w-6 shrink-0 mt-0.5'
        src='/img/event/summit-icon.png'
        alt='Smithed Summit 2026 icon'
        width={20}
        height={20}
      />
      <div>
        <p>
          You&apos;re submitting an entry to{' '}
          <span className='font-bold'>Smithed Summit 2026</span>! By uploading
          this song, you agree to:{' '}
        </p>
        <ul className='list-disc list-outside pl-5 mt-2 space-y-1'>
          <li>
            Read and follow the event&apos;s rules in our{' '}
            <Link
              href='/blog/smithed-summit-2026'
              target='_blank'
              className='text-blue-400 hover:text-blue-300 hover:underline'
            >
              blog post
            </Link>
            <FontAwesomeIcon
              className='text-blue-400 ml-1'
              size='xs'
              icon={faExternalLink}
            />
            .
          </li>
          <li>
            Include in the description which region you&apos;re submitting your
            song to be played in:
            <div className='flex flex-wrap gap-2 mt-2 pl-0 font-bold'>
              {EVENT_REGIONS.map((region) => {
                const isSelected = (description ?? '').includes(region.tag);

                return (
                  <button
                    key={region.tag}
                    type='button'
                    disabled={disabled}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs whitespace-nowrap transition-colors enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60',
                      region.pillClass,
                      isSelected && 'ring-2 ring-white/40',
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyRegion(region.tag)}
                  >
                    <span aria-hidden>{region.emoji}</span>
                    {region.label}
                  </button>
                );
              })}
            </div>
          </li>
          <li>
            You will be credited by the name shown in the Author field below.
            You can edit it by clicking your user icon in the top right corner
            of the page.
          </li>
          <li>
            You allow us and Smithed to play your submission on the event&apos;s
            server and distribute the converted data pack.
          </li>
        </ul>
      </div>
    </div>
  );
};
