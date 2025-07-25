import fs from 'fs';
import path from 'path';

import { Metadata } from 'next';

import { CustomMarkdown } from '@web/modules/shared/components/CustomMarkdown';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

async function PrivacyPolicyPage() {
  const fullPath = path.join('./public/docs/privacy.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  return <CustomMarkdown MarkdownContent={fileContents} />;
}

export default PrivacyPolicyPage;
