import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

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

const appendRegionTag = (description: string, tag: EventRegionTag): string => {
  if (description.includes(tag)) {
    return description;
  }

  let updated = description;
  for (const regionTag of EVENT_REGION_TAGS) {
    if (regionTag !== tag && updated.includes(regionTag)) {
      updated = updated.replace(regionTag, '');
    }
  }

  updated = updated.replace(/\n{3,}/g, '\n\n').trimEnd();
  const separator = updated.length > 0 ? '\n' : '';

  return `${updated}${separator}${tag}`;
};

type EventSubmissionInfoProps = {
  title?: string;
  description?: string;
  disabled?: boolean;
  onDescriptionChange: (description: string) => void;
};

export const EventSubmissionInfo: React.FC<EventSubmissionInfoProps> = ({
  title,
  description,
  disabled = false,
  onDescriptionChange,
}) => {
  const appendRegion = (tag: EventRegionTag) => {
    if (disabled) {
      return;
    }

    const next = appendRegionTag(description ?? '', tag);
    if (next !== description) {
      onDescriptionChange(next);
    }
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
            <ul className='list-none list-outside font-bold pl-5 mt-1 space-y-0.5'>
              <li>
                🌱{' '}
                <button
                  type='button'
                  disabled={disabled}
                  className='text-green-400 enabled:hover:underline enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'
                  onClick={() => appendRegion('[Patched Plateaus]')}
                >
                  [Patched Plateaus]
                </button>
              </li>
              <li>
                🍂{' '}
                <button
                  type='button'
                  disabled={disabled}
                  className='text-amber-400 enabled:hover:underline enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'
                  onClick={() => appendRegion('[Textured Tropics]')}
                >
                  [Textured Tropics]
                </button>
              </li>
              <li>
                🏭{' '}
                <button
                  type='button'
                  disabled={disabled}
                  className='text-blue-400 enabled:hover:underline enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'
                  onClick={() => appendRegion('[Welded Woodlands]')}
                >
                  [Welded Woodlands]
                </button>
              </li>
            </ul>
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
