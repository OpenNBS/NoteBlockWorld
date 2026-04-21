import path from 'path';

import { connectDatabase } from '@admin/db/connect';
import { createDatabaseModels } from '@admin/db/models';
import { parseEnvironment } from '@admin/env';
import { routeApiRequest } from '@admin/http/router';
import { type ServiceContext } from '@admin/services/context';
import { createS3StorageClient } from '@admin/storage/s3-client';

const env = parseEnvironment(process.env);

await connectDatabase(env.MONGO_URL);

const models = createDatabaseModels();
const storage = createS3StorageClient(env);
await storage.verifyBuckets();

const context: ServiceContext = {
  env,
  models,
  storage,
  startedAt: Date.now(),
};

async function resolvePublicRoot() {
  const candidates = [
    path.resolve(import.meta.dir, '../public'),
    path.resolve(import.meta.dir, '../dist/public'),
  ];

  for (const candidate of candidates) {
    if (await Bun.file(path.join(candidate, 'index.html')).exists()) {
      return candidate;
    }
  }

  return candidates[0];
}

const publicRoot = await resolvePublicRoot();

function safeResolvePublicPath(urlPath: string) {
  const normalized = path.normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, '');
  const fullPath = path.resolve(publicRoot, `.${normalized}`);

  if (!fullPath.startsWith(publicRoot)) {
    return null;
  }

  return fullPath;
}

async function serveStatic(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = safeResolvePublicPath(pathname);

  if (filePath) {
    const file = Bun.file(filePath);
    if (await file.exists()) {
      return new Response(file);
    }
  }

  const spaFallback = Bun.file(path.join(publicRoot, 'index.html'));
  if (await spaFallback.exists()) {
    return new Response(spaFallback);
  }

  return new Response('index.html was not found. Run `bun run build` first.', {
    status: 500,
  });
}

Bun.serve({
  hostname: env.ADMIN_APP_HOST,
  port: env.ADMIN_APP_PORT,
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return routeApiRequest(request, context);
    }

    return serveStatic(request);
  },
});

process.stdout.write(
  `@nbw/admin listening on http://${env.ADMIN_APP_HOST}:${env.ADMIN_APP_PORT}\n`,
);
