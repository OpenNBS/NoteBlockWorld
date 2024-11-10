import fs from 'fs';
import path from 'path';

import { CustomMarkdown } from '@web/src/modules/shared/components/CustomMarkdown';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Guidelines',
};

async function TermsOfServicePage() {
  const fullPath = path.join('./public/docs/guidelines.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  return <CustomMarkdown MarkdownContent={fileContents} />;
}

export default TermsOfServicePage;
