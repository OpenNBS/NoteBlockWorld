export function signOut() {
  // delete cookie
  deleteAuthCookies();
  // redirect to home
  window.location.href = '/';
}

export function deleteAuthCookies() {
  // delete cookie
  const cookiesToBeDeleted = ['refresh_token', 'user', 'token'];
  cookiesToBeDeleted.forEach((cookie) => {
    document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}
