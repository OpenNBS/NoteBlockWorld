'use client';

import { useSignOut } from '@web/src/modules/auth/components/client/login.util';

function Page() {
  useSignOut();

  return (
    <div>
      <p>You have been logged out.</p>
    </div>
  );
}

export default Page;
