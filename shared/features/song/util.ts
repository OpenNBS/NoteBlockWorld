import { Song } from '@encode42/nbs.js';

export function getTempoChangerInstrumentIds(song: Song): number[] {
  return song.instruments.loaded.flatMap((instrument, id) =>
    instrument.meta.name === 'Tempo Changer' ? [id] : [],
  );
}

export function getInstrumentNoteCounts(song: Song): Record<number, number> {
  const blockCounts = Object.fromEntries(
    Object.keys(song.instruments.loaded).map((instrumentId) => [
      instrumentId,
      0,
    ]),
  );

  for (const layer of song.layers) {
    for (const tick in layer.notes) {
      const note = layer.notes[tick];
      const instrumentId = note.instrument;
      blockCounts[instrumentId]++;
    }
  }

  return blockCounts;
}
