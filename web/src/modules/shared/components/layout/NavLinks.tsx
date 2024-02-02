import { LoggedUserData } from '@web/src/modules/auth/types/User';
import {
  SignInButton,
  SignOutButton,
  UploadButton,
  UserGreeting,
} from './SignOutButton';
export function NavLinks({
  isUserLoggedIn,
  userData,
}: {
  isUserLoggedIn: boolean;
  userData?: LoggedUserData;
}) {
  return (
    <div className='flex flex-row gap-2'>
      {!isUserLoggedIn && <SignInButton />}
      {isUserLoggedIn && userData && (
        <UserGreeting username={userData.username} />
      )}
      <UploadButton />
      {isUserLoggedIn && <SignOutButton />}
    </div>
  );
}
