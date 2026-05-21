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

type EventSubmissionInfoProps = {
  title?: string;
  description?: string;
};

export const EventSubmissionInfo: React.FC<EventSubmissionInfoProps> = ({
  title,
  description,
}) => {
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
            <ul className='list-disc list-outside font-bold pl-5 mt-1 space-y-0.5'>
              <li>[Patched Plateaus]</li>
              <li>[Textured Tropics]</li>
              <li>[Welded Woodlands]</li>
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
