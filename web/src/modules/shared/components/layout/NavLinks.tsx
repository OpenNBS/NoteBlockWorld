import { LoggedUserData } from '@web/src/modules/auth/types/User';
import { SignInButton, UploadButton, UserMenuButton } from './SignOutButton';
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
      {isUserLoggedIn && userData ? (
        <div className='flex items-center justify-center gap-7'>
          <UploadButton />

          <UserMenu userData={userData}></UserMenu>
        </div>
      ) : (
        <SignInButton />
      )}
    </div>
  );
}
