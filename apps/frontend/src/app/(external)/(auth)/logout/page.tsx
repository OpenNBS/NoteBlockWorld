'use client';

import { toast } from 'react-hot-toast';

import { useSignOut } from '@web/modules/auth/components/client/login.util';


function Page() {
  useSignOut();
  toast.success('You have been logged out!');
}

export default Page;
