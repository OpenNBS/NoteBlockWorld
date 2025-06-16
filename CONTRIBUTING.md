# Contributing to Note Block World

Hello! We're glad to have you interested in contributing to Note Block World. This document will guide you through the process of setting up the project and submitting your contributions.

This page is a work in progress and will be updated as the project evolves. If you have any questions or need help, feel free to reach out to us on our [Discord server](https://discord.gg/note-block-world-608692895179997252).

## Stack

This is a multipackage **monorepo** managed by [Bun](https://bun.sh/). It includes both the backend and frontend of the project:

- **Backend**: [NestJS](https://nestjs.com/)
- **Frontend**: [Next.js](https://nextjs.org/) with Server-Side Rendering (SSR)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **File Storage**: [Backblaze B2](https://www.backblaze.com/cloud-storage) via its S3-compatible API

## Setting up the project for development

You'll need the following installed on your machine:

- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

We provide a `docker-compose-dev.yml` file that sets up:

- A MongoDB instance
- A local mail server (`maildev`)
- An S3-compatible storage (`minio`)
- A MinIO client

To start the services, run the following in the root directory:

```bash
docker-compose -f docker-compose-dev.yml up -d
```

> Remove the `-d` flag if you'd like to see container logs in your terminal.

You can find authentication details in the [`docker-compose-dev.yml`](docker-compose-dev.yml) file.

---

## Environment Variables

Create `.env.development` and `.env.local` files in the `server` and `web` packages respectively, using the provided example files as a base. Alternatively, export them directly in your shell.

### Backend (`server`):

```bash
export NODE_ENV=development

export GITHUB_CLIENT_ID=UNSET
export GITHUB_CLIENT_SECRET=UNSET

export GOOGLE_CLIENT_ID=UNSET
export GOOGLE_CLIENT_SECRET=UNSET

export DISCORD_CLIENT_ID=UNSET
export DISCORD_CLIENT_SECRET=UNSET

export MAGIC_LINK_SECRET=development_magic_link_secret

# in seconds
export COOKIE_EXPIRES_IN=604800 # 1 week

export JWT_SECRET=developmentsecret
export JWT_EXPIRES_IN=1h

export JWT_REFRESH_SECRET=developmentrefreshsecret
export JWT_REFRESH_EXPIRES_IN=7d

export MONGO_URL=mongodb://noteblockworlduser:noteblockworldpassword@localhost:27017/noteblockworld?authSource=admin

export SERVER_URL=http://localhost:4000
export FRONTEND_URL=http://localhost:3000
#APP_DOMAIN=

export RECAPTCHA_KEY=disabled

export S3_ENDPOINT=http://localhost:9000
export S3_BUCKET_SONGS=noteblockworld-songs
export S3_BUCKET_THUMBS=noteblockworld-thumbs
export S3_KEY=minioadmin
export S3_SECRET=minioadmin
export S3_REGION=us-east-1

export WHITELISTED_USERS=

export DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/UNSET

export MAIL_TRANSPORT=smtp://user:pass@localhost:1025
export MAIL_FROM="Example <noreply@noteblock.world>"
```

> You’ll need to register developer applications with GitHub, Google, and Discord and replace the `UNSET` placeholders.

~~ For development, you can use the magic link login method instead. ~~

### Frontend (`web`):

On the frontend, you can set the environment variables in a `.env.local` file or directly in your shell. The following variables are required:

```bash
THUMBNAIL_URL=localhost:9000
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

## Installing Dependencies

To install all dependencies, run in the root of the project:

```bash
bun install
```

---

## Running the Project

To start both the backend and frontend:

```bash
bun run dev
```

To start them individually:

- Backend only:

  ```bash
  bun run dev:server
  ```

- Frontend only:

  ```bash
  bun run dev:web
  ```

> The frontend will run at [http://localhost:3000](http://localhost:3000)
> The backend API will be at [http://localhost:4000](http://localhost:4000)

---

## Seeding the Database (Development Only)

You can populate the development database with test data using:

```bash
curl -X 'GET' \
  'http://localhost:4000/api/v1/seed/seed-dev' \
  -H 'accept: */*'
```

> This route is only available in `NODE_ENV=development`. It will create some sample users, songs, and comments.

## Running Tests

Currently, tests are available for the `server` and `shared` packages.

We use [Jest](https://jestjs.io/) for testing. To run tests:

```bash
bun run test
```

Run this inside the package directory you want to test.
