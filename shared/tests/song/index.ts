import assert from 'assert';

import { openSongFromPath } from './util';
import { SongStatsGenerator } from '../../features/song/stats';

// TO RUN:
//
// From the root of the 'shared' package, run:
// $ ts-node tests/song/index.ts

// TODO: refactor to use a proper test runner (e.g. jest)

const testSongPaths = {
  simple: 'files/testSimple.nbs',
  extraPopulatedLayer: 'files/testExtraPopulatedLayer.nbs',
  loop: 'files/testLoop.nbs',
  outOfRange: 'files/testOutOfRange.nbs',
  outOfRangeCustomPitch: 'files/testOutOfRangeCustomPitch.nbs',
  customInstrumentNoUsage: 'files/testCustomInstrumentNoUsage.nbs',
  customInstrumentUsage: 'files/testCustomInstrumentUsage.nbs',
  tempoChangerWithStart: 'files/testTempoChangerWithStart.nbs',
  tempoChangerNoStart: 'files/testTempoChangerNoStart.nbs',
  tempoChangerDifferentStart: 'files/testTempoChangerDifferentStart.nbs',
  tempoChangerOverlap: 'files/testTempoChangerOverlap.nbs',
};

const testSongStats = Object.fromEntries(
  Object.entries(testSongPaths).map(([name, path]) => {
    return [name, SongStatsGenerator.getSongStats(openSongFromPath(path))];
  }),
);

function testSimple() {
  // Test that the stats are correctly calculated for a simple song with no
  // special properties.

  const stats = testSongStats.simple;

  assert(stats.midiFileName === '');
  assert(stats.noteCount === 10);
  assert(stats.tickCount === 19);
  assert(stats.layerCount === 3);
  assert(stats.tempo === 10.0);
  assert(stats.tempoRange === null);
  assert(stats.timeSignature === 4);
  assert(stats.duration.toFixed(2) === '1.90');
  assert(stats.loop === false);
  assert(stats.loopStartTick === 0);
  // assert(stats.minutesSpent === 0);
  assert(stats.vanillaInstrumentCount === 5);
  assert(stats.customInstrumentCount === 0);
  assert(stats.usesCustomInstruments === false);
  assert(stats.firstCustomInstrumentIndex === 16);
  assert(stats.notesOutsideOctaveRange === 0);
  assert(stats.compatible === true);

  assert(
    stats.instrumentNoteCounts.toString() ===
      [5, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 2].toString(),
  );
}

function testExtraPopulatedLayer() {
  // Test that the stats are correctly calculated for a song with an extra
  // populated layer. This means that the last layer has a property changed
  // (like volume or pitch) but no note blocks.

  const stats = testSongStats.extraPopulatedLayer;

  // Should be 5 if we want the last layer with a property changed, regardless
  // of the last layer with a note block. We currently don't account for this.
  assert(stats.layerCount === 3);
}

function testLoop() {
  // Test that the loop values are correct for a song that loops.

  const stats = testSongStats.loop;

  assert(stats.loop === true);
  assert(stats.loopStartTick === 7);
}

function testOutOfRange() {
  const stats = testSongStats.outOfRange;

  assert(stats.notesOutsideOctaveRange === 6);
  assert(stats.compatible === false);
}

function testCustomInstrumentNoUsage() {
  // Test that the instrument counts are correctly calculated if the song
  // contains custom instruments, but doesn't use them in any note.

  const stats = testSongStats.customInstrumentNoUsage;

  assert(stats.customInstrumentCount === 0);
  assert(stats.usesCustomInstruments === false);
}

function testCustomInstrumentUsage() {
  // Test that the instrument counts are correctly calculated if the song
  // contains custom instruments and uses them.

  const stats = testSongStats.customInstrumentUsage;
  const firstCustomIndex = stats.firstCustomInstrumentIndex;

  assert(stats.customInstrumentCount === 2);
  assert(stats.usesCustomInstruments === true);

  assert(stats.instrumentNoteCounts[firstCustomIndex + 0] === 3);
  assert(stats.instrumentNoteCounts[firstCustomIndex + 1] === 0);
  assert(stats.instrumentNoteCounts[firstCustomIndex + 2] === 2);
}

function testTempoChangerWithStart() {
  // Test with tempo changes. Includes a tempo changer at the start of the song
  // which matches the song's default tempo.

  const stats = testSongStats.tempoChangerWithStart;

  const duration = (1 / 10 + 1 / 12 + 1 / 14 + 1 / 16 + 1 / 18) * 4;

  assert(duration.toFixed(2) === stats.duration.toFixed(2));
  assert(stats.tempo === 10.0);
  assert(stats.tempoRange?.toString() === [10.0, 18.0].toString());
}

function testTempoChangerNoStart() {
  // Omits the tempo changer at the start. The code should properly consider
  // the song's default tempo at the start of the song.

  const stats = testSongStats.tempoChangerNoStart;

  const duration = (1 / 10 + 1 / 12 + 1 / 14 + 1 / 16 + 1 / 18) * 4;

  assert(duration.toFixed(2) === stats.duration.toFixed(2));
  assert(stats.tempo === 10.0);
  assert(stats.tempoRange?.toString() === [10.0, 18.0].toString());
}

function testTempoChangerDifferentStart() {
  // Includes a tempo changer at the start of the song with a different tempo
  // than the song's default tempo. The code should ignore the song's default
  // tempo and use the tempo from the tempo changer for calculating the song's
  // duration and tempo range. However, the 'tempo' attribute should still be set
  // to the song's default tempo.

  const stats = testSongStats.tempoChangerDifferentStart;

  const duration = (1 / 20 + 1 / 12 + 1 / 14 + 1 / 16 + 1 / 18) * 4;

  assert(duration.toFixed(2) === stats.duration.toFixed(2));
  assert(stats.tempo === 10.0);
  assert(stats.tempoRange?.toString() === [12.0, 20.0].toString());
}

function testTempoChangerOverlap() {
  // Includes overlapping tempo changers within the same tick. The code
  // should only consider the bottom-most tempo changer in each tick.

  const stats = testSongStats.tempoChangerOverlap;

  const duration = (1 / 10 + 1 / 12 + 1 / 4 + 1 / 16 + 1 / 18) * 4;

  assert(duration.toFixed(2) === stats.duration.toFixed(2));
  assert(stats.tempo === 10.0);
  assert(stats.tempoRange?.toString() === [4.0, 18.0].toString());
}

function runTest(test: () => void) {
  console.log('\n------------------------------------');

  try {
    test();
    console.log(`✅ Passed: ${test.name}`);
  } catch (e: any) {
    console.error(`❌ Failed: ${test.name}\n`);
    console.error(e.stack);
  }

  console.log('------------------------------------\n');
}

function runAllTests() {
  runTest(testSimple);
  runTest(testExtraPopulatedLayer);
  runTest(testLoop);
  runTest(testOutOfRange);
  runTest(testOutOfRangeCustomPitch);
  runTest(testCustomInstrumentNoUsage);
  runTest(testCustomInstrumentUsage);
  runTest(testTempoChangerWithStart);
  runTest(testTempoChangerNoStart);
  runTest(testTempoChangerDifferentStart);
  runTest(testTempoChangerOverlap);
}

runAllTests();
