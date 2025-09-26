import { spawn } from 'bun';

// This is a list on how the packages can be built in order
// the sub array is for packages that can be built in parallel
const packages: (string | string[])[] = [
  ['@nbw/config', '@nbw/sounds', '@nbw/database'],
  '@nbw/song',
  '@nbw/thumbnail',
];

async function buildPackages() {
  for (const p of packages) {
    if (Array.isArray(p)) {
      // Build packages in parallel
      const promises = p.map((pkg) =>
        spawn(['bun', 'run', '--filter', pkg, 'build']),
      );
      await Promise.all(promises);
    } else {
      // Build single package
      await spawn(['bun', 'run', '--filter', p, 'build']);
    }
  }
}

buildPackages().catch(console.error);
