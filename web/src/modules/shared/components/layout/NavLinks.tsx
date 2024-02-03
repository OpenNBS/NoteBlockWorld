import { LoggedUserData } from '@web/src/modules/auth/types/User';
import { SignInButton, UploadButton, UserSettings } from './SignOutButton';

export function NavLinks({
  isUserLoggedIn,
  userData,
}: {
  isUserLoggedIn: boolean;
  userData?: LoggedUserData;
}) {
  return (
    <div className='flex flex-row gap-2 justify-end'>
      {isUserLoggedIn && userData ? (
        <div className='flex items-center justify-center gap-7'>
          <UploadButton />
          <UserSettings userData={userData} />
        </div>
      ) : (
        <SignInButton />
      )}
    </div>
  );
}
