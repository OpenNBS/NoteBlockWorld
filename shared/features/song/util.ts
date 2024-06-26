import { Song } from '@encode42/nbs.js';

export function getTempoChangerInstrumentIds(song: Song): number[] {
  return song.instruments.loaded.flatMap((instrument, id) =>
    instrument.meta.name === 'Tempo Changer' ? [id] : [],
  );
}
