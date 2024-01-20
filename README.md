# NoteBlockWorld

A website to share, discover and listen to note block music

## Installation

To easily install the project, you can use the [docker-compose.yml](docker-compose.yml) file.

```bash
docker-compose up -d
```

env variables are configured in the [docker-compose.yml](docker-compose.yml) file

---

Or use `pnpm` without docker

```bash
npm i -g pnpm
pnpm install
```

configure the env variables in bash

```bash
export JWT_SECRET="jwtsecret"
export JWT_EXPIRES_IN="1d"
export ZERO_CLIENT_ID=""
export ZERO_CLIENT_SECRET=""
export DB_HOST="localhost:27017"
export DB_PASSWORD="noteblockwordpassword"
export DB_USER="noteblockworduser"
export SERVER_URL="http://localhost:3000"
```

you can generate a jwt secret with openssl and replace `jwtsecret` with the output

```bash
openssl rand -hex 64
```

In windows you can use `set` instead of `export`

```bash
set JWT_SECRET="jwtsecret"
set JWT_EXPIRES_IN="1d"
set DB_HOST="mongodb://localhost:27017/noteblockword"
set DB_PASSWORD="noteblockwordpassword"
set DB_USER="noteblockworduser"
set SERVER_URL="http://localhost:3000"
```

then run the server

```bash
pnpm run dev
```
