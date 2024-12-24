# Contributing to Note Block World

Hello! We're glad to have you interested in contributing to Note Block World. This document will guide you through the process of setting up the project and submitting your contributions.

This page is a work-in-progress and will be updated as the project evolves. If you have any questions or need help, feel free to reach out to us on our [Discord server](https://discord.gg/note-block-world-608692895179997252).

## Stack

This is a multipackage monorepo managed by [pnpm](https://pnpm.io/), which houses both the backend and frontend of the website. The backend is built with [NestJS](https://nestjs.com/) and the frontend is built with [Next.js](https://nextjs.org/) using server-side rendering (SSR). We use [MongoDB](https://www.mongodb.com/) as our database and [Backblaze B2](https://www.backblaze.com/cloud-storage) for file storage via its S3-compatible API.

## Setting up

To easily install the project, you can use the [docker-compose.yml](docker-compose.yml) file.

```bash
docker-compose up -d
```

This will start the backend and frontend servers, as well as a MongoDB instance.

---

Alternatively, you can install and use `pnpm` directly:

```bash
npm i -g pnpm
pnpm install
```

To configure the env variables, create `.env.development` and `.env.local` files in the backend and front-end packages, based on the example files provided. Alternatively, set the environment variables directly in your shell:

```bash
export JWT_SECRET="jwtsecret"
export JWT_EXPIRES_IN="1d"
export DB_HOST="localhost:27017"
export DB_PASSWORD="noteblockworldpassword"
export DB_USER="noteblockworlduser"
export SERVER_URL="http://localhost:3000"
```

You can generate a JWT secret with OpenSSL and replace `jwtsecret` with the output:

```bash
openssl rand -hex 64
```

In Windows, you can use `set` instead of `export`:

```bash
set JWT_SECRET="jwtsecret"
set JWT_EXPIRES_IN="1d"
set DB_HOST="mongodb://localhost:27017/noteblockworld"
set DB_PASSWORD="noteblockworldpassword"
set DB_USER="noteblockworlduser"
set SERVER_URL="http://localhost:3000"
```

Finally, to run the frontend and backend servers:

```bash
pnpm run dev
```

The backend server will be available at [http://localhost:3000](http://localhost:3000) and the frontend server will be available at [http://localhost:4000](http://localhost:4000).
