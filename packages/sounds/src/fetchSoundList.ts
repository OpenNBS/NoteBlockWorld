import type { AssetIndexData, VersionData, VersionManifest } from './types';

const MANIFEST_URL =
  'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json';

async function fetchWithCache(url: string) {
  const response = await fetch(url);
  console.log('fetchWithCache', url, response.status);
  return response.json();
}

async function fetchVersionManifest() {
  const url = MANIFEST_URL;
  const data = await fetchWithCache(url);
  return data as VersionManifest;
}

async function getLatestVersion(type: 'release' | 'snapshot' = 'release') {
  const manifestData = await fetchVersionManifest();
  const version = manifestData.latest[type];
  return version;
}

async function getVersionSummary(version: string) {
  const manifestData = await fetchVersionManifest();
  const versionData = manifestData.versions.find((v) => v.id === version);

  if (!versionData) {
    throw new Error(`Version ${version} not found`);
  }

  return versionData;
}

async function getVersionData(version: string) {
  const versionData = await getVersionSummary(version);
  const url = versionData.url;
  const data = await fetchWithCache(url);
  return data as VersionData;
}

async function getAssetIndexSummary(version: string) {
  const versionData = await getVersionData(version);
  const assetIndex = versionData.assetIndex;
  return assetIndex;
}

async function getAssetIndexObjects(version: string) {
  const assetIndex = await getAssetIndexSummary(version);
  const url = assetIndex.url;
  const data = (await fetchWithCache(url)) as AssetIndexData;
  return data.objects;
}

async function getAssetIndexSounds(version: string) {
  const objects = await getAssetIndexObjects(version);

  // Get a new record with only keys that end with '.ogg'
  const sounds = Object.entries(objects).filter(([key]) =>
    key.endsWith('.ogg')
  );

  return sounds;
}

async function getSoundList(version: string) {
  const sounds = await getAssetIndexSounds(version);

  // Return an object with sound names as keys and hashes as values
  const soundList = Object.fromEntries(
    sounds.map(([key, { hash }]) => [key, hash])
  );

  return soundList;
}

export async function getLatestVersionSoundList() {
  const version = await getLatestVersion();
  const soundList = await getSoundList(version);
  return soundList;
}

// Export the return type of the function as SoundList
export type SoundListType = Awaited<
  ReturnType<typeof getLatestVersionSoundList>
>;
