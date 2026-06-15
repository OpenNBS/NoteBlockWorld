import assert from 'assert';
import { readFileSync } from 'fs';
import { join, resolve } from 'path';

import { Instrument, toArrayBuffer } from '@encode42/nbs.js';

import {
  NBS_V6_FIRST_CUSTOM,
  UnsupportedNbsVersionError,
  getNbsFormatVersion,
  loadNbsFromBuffer,
  normalizeNbsSong,
} from '../../src/nbsCompat';
import { SongObfuscator } from '../../src/obfuscate';
import { SongStatsGenerator } from '../../src/stats';

import { asArrayBuffer, openSongFromPath } from './util';

const fixturesDir = join(resolve(import.meta.dir), 'files');

function createV6TestSong() {
  const song = openSongFromPath('files/testSimple.nbs');

  song.nbsVersion = 6;
  song.instruments.firstCustomIndex = NBS_V6_FIRST_CUSTOM;
  normalizeNbsSong(song);

  const layer = song.layers[0];
  song.addNote(layer, 0, 16, { key: 45 });
  song.addNote(layer, 4, 17, { key: 50 });
  song.addNote(layer, 8, 18, { key: 55 });
  song.addNote(layer, 12, 19, { key: 60 });

  song.instruments.loaded[NBS_V6_FIRST_CUSTOM] = new Instrument(
    NBS_V6_FIRST_CUSTOM,
    {
      name: 'Test Custom',
      soundFile: 'custom.ogg',
      key: 45,
    },
  );
  song.addNote(layer, 16, NBS_V6_FIRST_CUSTOM, { key: 45 });

  return song;
}

describe('nbsCompat', () => {
  it('leaves v5 songs unchanged', () => {
    const song = openSongFromPath('files/testSimple.nbs');

    assert.strictEqual(song.nbsVersion, 5);
    assert.strictEqual(song.instruments.firstCustomIndex, 16);
    assert.strictEqual(song.instruments.loaded.length, 16);
  });

  it('pads v5 instrumentNoteCounts to at least 16 slots', () => {
    const stats = SongStatsGenerator.getSongStats(
      openSongFromPath('files/testSimple.nbs'),
    );

    assert(stats.instrumentNoteCounts.length >= 16);
    assert.strictEqual(stats.firstCustomInstrumentIndex, 16);
  });

  it('normalizes v6 built-in instruments at indices 16–19', () => {
    const song = createV6TestSong();

    assert.strictEqual(song.instruments.firstCustomIndex, 20);
    assert.strictEqual(song.instruments.loaded[16]?.builtIn, true);
    assert.strictEqual(song.instruments.loaded[16]?.meta.name, 'Trumpet');
    assert.strictEqual(song.instruments.loaded[19]?.builtIn, true);
    assert.strictEqual(
      song.instruments.loaded[NBS_V6_FIRST_CUSTOM]?.meta.name,
      'Test Custom',
    );
  });

  it('pads v6 instrumentNoteCounts to at least 20 slots', () => {
    const stats = SongStatsGenerator.getSongStats(createV6TestSong());

    assert(stats.instrumentNoteCounts.length >= 20);
    assert.strictEqual(stats.firstCustomInstrumentIndex, 20);
    assert.strictEqual(stats.instrumentNoteCounts[16], 1);
    assert.strictEqual(stats.instrumentNoteCounts[19], 1);
    assert.strictEqual(stats.instrumentNoteCounts[20], 1);
  });

  it('preserves v6 format when obfuscating', () => {
    const song = createV6TestSong();
    const obfuscated = SongObfuscator.obfuscateSong(song, ['customhash']);

    assert.strictEqual(getNbsFormatVersion(obfuscated), 6);
    assert.strictEqual(obfuscated.nbsVersion, 6);
    assert.strictEqual(obfuscated.instruments.firstCustomIndex, 20);
    assert.strictEqual(obfuscated.instruments.loaded[16]?.builtIn, true);
    assert.strictEqual(
      obfuscated.instruments.loaded[20]?.meta.soundFile,
      'customhash',
    );
  });

  it('round-trips v6 through toArrayBuffer', () => {
    const buffer = toArrayBuffer(createV6TestSong());
    const reloaded = loadNbsFromBuffer(buffer);

    assert.strictEqual(reloaded.nbsVersion, 6);
    assert.strictEqual(reloaded.instruments.firstCustomIndex, 20);
    assert.strictEqual(reloaded.instruments.loaded[16]?.builtIn, true);
    assert.strictEqual(
      reloaded.instruments.loaded[NBS_V6_FIRST_CUSTOM]?.meta.name,
      'Test Custom',
    );
  });

  it('loads v6 fixture file', () => {
    const fixturePath = join(fixturesDir, 'testV6Trumpets.nbs');
    const buffer = asArrayBuffer(readFileSync(fixturePath));
    const song = loadNbsFromBuffer(buffer);

    assert.strictEqual(song.nbsVersion, 6);
    assert.strictEqual(song.instruments.firstCustomIndex, 20);
    assert.strictEqual(song.instruments.loaded[16]?.builtIn, true);
  });

  it('throws an error if the NBS version is too high', () => {
    const song = createV6TestSong();
    song.nbsVersion = 7;
    assert.throws(
      () => loadNbsFromBuffer(toArrayBuffer(song)),
      UnsupportedNbsVersionError,
    );
  });
});
