'use client';
//import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function deleteAuthCookies() {
  // delete cookie
  const cookiesToBeDeleted = ['refresh_token', 'user', 'token'];
  cookiesToBeDeleted.forEach((cookie) => {
    // document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}

/**
 * A React hook that signs out the user.
 *
 * This hook will delete the authentication cookies and redirect the user to the login page.
 * It should be used in a React component, and will run automatically when the component is mounted.
 *
 *
 * **Its like a quick kick out of the system.**
 *
 * @example
 * ```jsx
 * function LogoutComponent() {
 *   useSignOut();
 *
 *   return <p>You have been logged out.</p>;
 * }
 * ```
 *
 * @returns {null} This hook does not return anything.
 */
export function useSignOut() {
  //const router = useRouter();
  function signOut() {
    deleteAuthCookies();
    /* We have to use window.location.href here,
       because next should clear the cached page in the client side
      */
    window.location.href = '/';
  }
  useEffect(() => {
    signOut();
  }, []);

  return null; // we don't need to return anything
}
