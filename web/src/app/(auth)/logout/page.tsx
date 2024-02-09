'use client';

import { useSignOut } from '@web/src/modules/auth/components/client/login.util';
import { redirect } from 'next/navigation';

function Page() {
  useSignOut();
}

export default Page;
