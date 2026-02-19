import { $ } from 'bun';
import { existsSync, readdirSync, renameSync, rmSync } from 'fs';
import { join } from 'path';

// When running via "bun run scripts/build.ts", process.cwd() is the package root
const packageRoot = process.cwd();

async function clean() {
  const distPath = join(packageRoot, 'dist');
  if (existsSync(distPath)) {
    rmSync(distPath, { recursive: true, force: true });
  }
}

async function buildNode() {
  const result = await Bun.build({
    entrypoints: [join(packageRoot, 'src', 'index.ts')],
    outdir: join(packageRoot, 'dist'),
    target: 'node',
  });

  if (!result.success) {
    console.error('Bun build (node) failed:', result.logs);
    process.exit(1);
  }

  // Rename index.js to index.node.js
  const indexJs = join(packageRoot, 'dist', 'index.js');
  const indexNodeJs = join(packageRoot, 'dist', 'index.node.js');
  if (existsSync(indexJs)) {
    renameSync(indexJs, indexNodeJs);
  }

  console.log('Bun build (node) completed successfully');
}

async function buildBrowser() {
  const result = await Bun.build({
    entrypoints: [join(packageRoot, 'src', 'index.ts')],
    outdir: join(packageRoot, 'dist'),
    target: 'browser',
  });

  if (!result.success) {
    console.error('Bun build (browser) failed:', result.logs);
    process.exit(1);
  }

  // Rename index.js to index.browser.js
  const indexJs = join(packageRoot, 'dist', 'index.js');
  const indexBrowserJs = join(packageRoot, 'dist', 'index.browser.js');
  if (existsSync(indexJs)) {
    renameSync(indexJs, indexBrowserJs);
  }

  console.log('Bun build (browser) completed successfully');
}

async function buildTypes() {
  // Change to package root directory for tsc command
  const result = await $`cd ${packageRoot} && tsc -b`.quiet();

  if (result.exitCode !== 0) {
    console.error('TypeScript build failed');
    process.exit(1);
  }

  console.log('TypeScript declaration files generated');
}

function fixDeclarationFiles() {
  const distSrcPath = join(packageRoot, 'dist', 'src');
  const distPath = join(packageRoot, 'dist');

  if (existsSync(distSrcPath)) {
    const files = readdirSync(distSrcPath);

    // Move all .d.ts files from dist/src to dist
    for (const file of files) {
      if (file.endsWith('.d.ts')) {
        const srcFile = join(distSrcPath, file);
        const destFile = join(distPath, file);
        renameSync(srcFile, destFile);
        console.log(`Moved ${file} to dist/`);
      }
    }

    // Remove the now-empty dist/src directory
    try {
      rmSync(distSrcPath, { recursive: true, force: true });
    } catch (error) {
      // Ignore errors if directory is not empty or doesn't exist
    }
  }
}

async function build() {
  console.log('Cleaning dist directory...');
  await clean();

  console.log('Building with Bun (node target)...');
  await buildNode();

  console.log('Building with Bun (browser target)...');
  await buildBrowser();

  console.log('Building TypeScript declaration files...');
  await buildTypes();

  console.log('Fixing declaration file locations...');
  fixDeclarationFiles();

  console.log('Build completed successfully!');
}

build().catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
