# Contributing to Note Block World

Hello! We're glad to have you interested in contributing to Note Block World. This document will guide you through the process of setting up the project and submitting your contributions.

This page is a work in progress and will be updated as the project evolves. If you have any questions or need help, feel free to reach out to us on our [Discord server](https://discord.gg/note-block-world-608692895179997252).

## Stack

This is a multipackage monorepo managed by [pnpm](https://pnpm.io/), which houses both the backend and frontend of the website. The backend is built with [NestJS](https://nestjs.com/) and the frontend is built with [Next.js](https://nextjs.org/) using server-side rendering (SSR). We use [MongoDB](https://www.mongodb.com/) as our database and [Backblaze B2](https://www.backblaze.com/cloud-storage) for file storage via its S3-compatible API.

## Setting up the project for development

To easily install the project, you can use the [docker-compose-dev.yml](docker-compose-dev.yml) file.

```bash
docker-compose -f docker-compose-dev.yml up -d
```
obs: You can remove the `-d` flag to see the containers' logs.

This will start a database container, a maildev container, a minio container, and a minio-client container.
You can check the authentication details in the [docker-compose-dev.yml](docker-compose-dev.yml) file.

To configure the env variables, create `.env.development` and `.env.local` files in the [backend](server) and [front-end](web) packages, based on the example files provided. Alternatively, set the environment variables directly in your shell like so:

### backend:

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

Note that for the OAuth providers, you will need to create an application on their respective developer portals and replace `UNSET` , in development, you can use the magic link login method for easy testing.

### frontend:

```bash
export THUMBNAIL_URL=localhost:9000
export NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Le7JNEpAAAAAN7US0WVtz10Mb-IfnTgw-IvEC6s"
export NEXT_PUBLIC_URL=http://localhost:3000
export NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```


In Windows, you can use `set` instead of `export`.
```cmd
set THUMBNAIL_URL=localhost:9000
set NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Le7JNEpAAAAAN7US0WVtz10Mb-IfnTgw-IvEC6s"
set NEXT_PUBLIC_URL=http://localhost:3000
set NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

Finally, to run the frontend and backend servers:

```bash
pnpm run dev
```

If you only want to run the backend or frontend, you can use the following commands:

```bash
pnpm run dev:server
```

```bash
pnpm run dev:web
```

The backend server will be available at [http://localhost:3000](http://localhost:3000) and the frontend server will be available at [http://localhost:4000](http://localhost:4000).


For populating the database with some test data by sending a post request: 

```bash
curl -X 'GET' \
  'http://localhost:4000/api/v1/seed/seed-dev' \
  -H 'accept: */*'
```

Just so you know, the seed route is only available in development mode.

Currently, tests are only available for the [backend](server), and [shared](shared) packages.

We use [Jest](https://jestjs.io/) for testing. To run the tests, you can use the following command on the package you want to test:

```bash
pnpm test
```

## Code style

We provide a [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/) configuration for the project. You can run the following command to format your code:
```bash
pnpm run lint
```
