import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import { getLatestVersionSoundList } from '@nbw/sounds';
import * as Bun from 'bun';

const writeSoundList = async () => {
  function writeJSONFile(
    dir: string,
    fileName: string,
    data: Record<string, any> | string[],
  ) {
    const path = resolve(dir, fileName);
    const jsonString = JSON.stringify(data, null, 0);
    writeFileSync(path, jsonString);
  }

  const dataDir = resolve(__dirname, '..', 'public', 'data');

  const soundListPath = 'soundList.json';

  // Try to create the output directory if it doesn't exist
  try {
    mkdirSync(dataDir, { recursive: true });
  } catch (err) {
    if (err instanceof Error && err.message.includes('EEXIST')) {
      console.log('Sound data files already exist; skipping generation.');
      process.exit(0);
    }
  }

  // If the files already exist, exit early
  const files = [soundListPath].map((fileName) => resolve(dataDir, fileName));

  if (files.every((file) => existsSync(file))) {
    console.log('Sound data files already exist; skipping generation.');
    process.exit(0);
  }

  console.log('Generating sound data files...');

  // Write list of sounds in the latest MC version to a JSON file
  // Filter the list to only include sounds that match the chosen patterns
  // (defined in the shared/ module)
  getLatestVersionSoundList().then((soundList) => {
    writeJSONFile(dataDir, soundListPath, soundList);
  });
};

const build = async () => {
  await Bun.$`rm -rf dist`;

  const optionalRequirePackages = [
    'class-transformer',
    'class-transformer/storage',
    'class-validator',
    '@nestjs/microservices',
    '@nestjs/websockets',
    '@fastify/static',
  ];

  const result = await Bun.build({
    entrypoints: ['./src/main.ts'],
    outdir     : './dist',
    target     : 'bun',
    minify     : false,
    sourcemap  : 'linked',
    external   : optionalRequirePackages.filter((pkg) => {
      try {
        require(pkg);
        return false;
      } catch (_) {
        return true;
      }
    }),
    splitting: true,
  });

  if (!result.success) {
    console.log(result.logs[0]);
    process.exit(1);
  }

  console.log('Built successfully!');
};

build()
  .then(() => {
    writeSoundList();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
