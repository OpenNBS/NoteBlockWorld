export const getTokenLocal = (): string | never => {
  // get the token cookie
  const cookie = document.cookie;

  const token = cookie
    .split('; ')
    .find((row) => row.startsWith('token'))
    ?.split('=')[1];

  // TODO: should be changed to a redirect to the login page?
  if (!token) throw new Error('Failed to get token');

  return token;
};
