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
export DB_HOST="localhost:27017"
export DB_PASSWORD="noteblockworldpassword"
export DB_USER="noteblockworlduser"
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
set DB_HOST="mongodb://localhost:27017/noteblockworld"
set DB_PASSWORD="noteblockworldpassword"
set DB_USER="noteblockworlduser"
set SERVER_URL="http://localhost:3000"
```

then run the server

```bash
pnpm run dev
```
