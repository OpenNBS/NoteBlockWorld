'use client';

import { redirect } from 'next/navigation';

import { useSignOut } from '@web/src/modules/auth/components/client/login.util';

function Page() {
  useSignOut();
}

export default Page;
