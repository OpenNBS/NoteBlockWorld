import fs from 'fs';
import path from 'path';

import { CustomMarkdown } from '@web/src/modules/shared/components/CustomMarkdown';

async function PrivacyPolicyPage() {
  const fullPath = path.join('./public/privacy.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  return <CustomMarkdown MarkdownContent={fileContents} />;
}

export default PrivacyPolicyPage;
