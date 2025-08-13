'use client';

import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UPLOAD_CONSTANTS } from '@nbw/config';
import Markdown from 'react-markdown';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@web/modules/shared/components/tooltip';

export const LicenseTooltip = ({ description }: { description: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type='button' className='text-zinc-500 cursor-default'>
          <FontAwesomeIcon icon={faQuestionCircle} />
        </button>
      </TooltipTrigger>
      <TooltipContent className='max-w-64 px-2.5 py-2 flex flex-col gap-2 [&_a]:text-blue-400 [&_a:hover]:text-blue-300'>
        {<Markdown>{description}</Markdown>}
      </TooltipContent>
    </Tooltip>
  );
};

export const LicenseInfo = ({ license }: { license: string }) => {
  // @ts-expect-error - read-only object cannot be indexed with a string
  const licenseInfo = UPLOAD_CONSTANTS.licenses[license];

  if (!licenseInfo) {
    return null;
  }

  return (
    <div className='flex items-center gap-3'>
      <p className='text-sm text-zinc-400'>License</p>
      <p className='text-sm'>{licenseInfo.name}</p>
      <LicenseTooltip description={licenseInfo.description} />
    </div>
  );
};
