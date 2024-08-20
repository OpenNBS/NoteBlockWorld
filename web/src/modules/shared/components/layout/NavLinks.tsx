import { LoggedUserData } from '@web/src/modules/auth/types/User';

import { SignInButton, UploadButton } from './SignOutButton';
import { SettingsMenu } from './SettingsMenu';
import { UserMenu } from './UserMenu';

export function NavLinks({
  isUserLoggedIn,
  userData,
}: {
  isUserLoggedIn: boolean;
  userData?: LoggedUserData;
}) {
  return (
    <div className='flex flex-row gap-2 justify-end'>
      <div className='flex items-center justify-center gap-7'>
        <SettingsMenu />
        <UploadButton />
        {isUserLoggedIn && userData ? (
          <UserMenu userData={userData} />
        ) : (
          <SignInButton />
        )}
      </div>
    </div>
  );
}
