import { $ } from 'bun';

import tailwindcss from '@tailwindcss/postcss';
import postcss from 'postcss';

const DIST_DIR = './dist';
const PUBLIC_DIR = `${DIST_DIR}/public`;
const SERVER_DIR = `${DIST_DIR}/server`;

async function buildStyles() {
  const sourceCss = await Bun.file('./src/web/styles.css').text();
  const output = await postcss([tailwindcss()]).process(sourceCss, {
    from: './src/web/styles.css',
    to: `${PUBLIC_DIR}/styles.css`,
  });

  await Bun.write(`${PUBLIC_DIR}/styles.css`, output.css);
}

async function buildSpa() {
  const result = await Bun.build({
    entrypoints: ['./src/web/main.tsx'],
    outdir: PUBLIC_DIR,
    target: 'browser',
    format: 'esm',
    splitting: false,
    minify: false,
    sourcemap: 'linked',
  });

  if (!result.success) {
    throw new Error(
      `SPA build failed: ${result.logs.map((log) => log.message).join('\n')}`,
    );
  }

  await Bun.write(
    `${PUBLIC_DIR}/index.html`,
    await Bun.file('./src/web/index.html').text(),
  );
}

async function buildServer() {
  const result = await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: SERVER_DIR,
    target: 'bun',
    format: 'esm',
    splitting: false,
    minify: false,
    sourcemap: 'linked',
    external: ['@nbw/database', '@nbw/config', '@nbw/validation'],
  });

  if (!result.success) {
    throw new Error(
      `Server build failed: ${result.logs
        .map((log) => log.message)
        .join('\n')}`,
    );
  }
}

async function buildAll() {
  await $`rm -rf ${DIST_DIR}`;
  await $`mkdir -p ${PUBLIC_DIR} ${SERVER_DIR}`;

  await Promise.all([buildStyles(), buildSpa(), buildServer()]);
}

if (process.argv.includes('--watch')) {
  throw new Error(
    'Watch mode is handled by `bun --watch run src/index.ts` in `bun run dev`.',
  );
}

buildAll()
  .then(() => {
    process.stdout.write('Built admin app successfully.\n');
  })
  .catch((error) => {
    process.stderr.write(`${String(error)}\n`);
    process.exit(1);
  });
