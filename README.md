# NoteBlockWorld

A website to share, discover and listen to note block music

## Installation

To easily install the project, you can use the [docker-compose.yml](docker-compose.yml) file.

```bash
docker-compose up -d
```

env variables are configured in the [docker-compose.yml](docker-compose.yml) file

--------------------------------------------

Or use `pnpm`

```bash
npm i -g pnpm
pnpm install
```

configure the env variables in bash
```bash
export MONGO_URL="mongodb://localhost:27017/noteblockworld"
```

or in windows
```bash
set MONGO_URL="mongodb://localhost:27017/noteblockworld"
```

then run the server
```bash
pnpm run dev
```