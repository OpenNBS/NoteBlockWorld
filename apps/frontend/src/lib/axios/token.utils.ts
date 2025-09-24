export const getTokenLocal = (): string | never => {
    // get the token cookie
    const cookie = document.cookie;

    const token = cookie
        .split('; ')
        .find((row) => row.startsWith('token'))
        ?.split('=')[1];

    // TODO: should be changed to a redirect to the login page?
    if (!token) throw new InvalidTokenError('Token not found');

    return token;
};

export class InvalidTokenError extends Error {
    constructor(msg: string) {
        super(msg);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InvalidTokenError.prototype);
    }
}
