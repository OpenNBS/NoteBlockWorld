import { LoggedUserData } from '@web/modules/auth/types/User';

import { SettingsMenu } from './SettingsMenu';
import { SignInButton, UploadButton } from './SignOutButton';
import { UserMenu } from './UserMenu';

export function NavLinks({
  isUserLoggedIn,
  userData,
}: {
  isUserLoggedIn: boolean;
  userData?: LoggedUserData;
}) {
  return (
    <div className='flex items-center justify-center w-fit gap-1 md:gap-6'>
      <SettingsMenu />
      <UploadButton />
      {isUserLoggedIn && userData ? (
        <UserMenu userData={userData} />
      ) : (
        <SignInButton />
      )}
    </div>
  );
}
