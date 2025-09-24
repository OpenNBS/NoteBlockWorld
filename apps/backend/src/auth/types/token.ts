export type TokenPayload = {
    id      : string;
    email   : string;
    username: string;
};

export type Tokens = {
    access_token : string;
    refresh_token: string;
};
