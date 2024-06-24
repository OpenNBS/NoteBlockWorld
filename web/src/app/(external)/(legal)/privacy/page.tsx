import fs from 'fs';
import path from 'path';

import { CustomMarkdown } from '@web/src/modules/shared/components/CustomMarkdown';

async function PrivacyPolicyPage() {
  const fullPath = path.join('./public/privacy.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  return (
    <div className='md:py-[8rem]'>
      <div className='p-8 mx-auto max-w-screen-lg md:rounded-3xl bg-zinc-950/50 backdrop-blur-[10px]'>
        <CustomMarkdown MarkdownContent={fileContents} />
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
