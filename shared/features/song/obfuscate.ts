import { Note, Song } from '@encode42/nbs.js';

export function obfuscateSong(song: Song): Song {
  const output = new Song();

  // ✅ Clear work stats
  // ✅ Copy: title, author, description, loop info, time signature

  output.meta.name = song.meta.name;
  output.meta.author = song.meta.author;
  output.meta.description = song.meta.description;

  output.loop.enabled = song.loop.enabled;
  output.loop.startTick = song.loop.startTick;
  output.loop.totalLoops = song.loop.totalLoops;

  output.tempo = song.tempo;
  output.timeSignature = song.timeSignature;

  // TODO: Remove unused instruments
  // TODO: Remove instrument info (name, press) - keep sound hash and pitch

  const noteCountPerInstrument = {};
  const tempoChangerIds: number[] = [];

  const lastLayerInTick = new Map<number, number>();

  const instrumentMapping: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
  };

  // ✅ Pile notes at the top
  // ✅ Bake layer volume into note velocity
  // ✅ Bake layer pan into note pan
  // ✅ Flatten note key and pitch
  // ✅ Remove silent notes (except Tempo Changers)
  // ✅ Remove everything in locked layers
  // ✅ Remove all layer info (name, volume, panning)

  for (const [layerId, layer] of song.layers.entries()) {
    if (layer.isLocked || layer.volume === 0) {
      continue;
    }

    console.log('Processing layer', layerId);

    for (const tickStr in layer.notes) {
      const note = layer.notes[tickStr];
      const tick = parseInt(tickStr);

      const isTempoChanger = tempoChangerIds.includes(note.instrument); // TODO: doesn't work yet

      if (note.velocity === 0 && !isTempoChanger) continue;

      // Key + pitch
      const factoredPitch = note.key * 100 + note.pitch;
      const key = factoredPitch / 100;
      const pitch = factoredPitch % 100;

      // Instrument
      let instrument;

      if (note.instrument < song.instruments.firstCustomIndex) {
        instrument = note.instrument;
      } else {
        continue;
        // TODO: instrument = instrumentMapping[note.instrument];
      }

      // Velocity
      let velocity = ((note.velocity / 100) * layer.volume) / 100;
      velocity = Math.round(velocity * 100);

      // Panning
      let panning;

      if (layer.stereo === 0) {
        panning = note.panning;
      } else {
        panning = (note.panning + layer.stereo) / 2;
      }

      // Create new note
      const newNote = new Note(instrument, {
        key,
        velocity,
        panning,
        pitch,
      });

      // Add to output
      let layerIdToAddNoteTo = lastLayerInTick.get(tick);

      if (layerIdToAddNoteTo === undefined) {
        layerIdToAddNoteTo = 0;
      }

      lastLayerInTick.set(tick, layerIdToAddNoteTo + 1);

      const layerToAddNoteTo =
        output.layers[layerIdToAddNoteTo] || output.createLayer();

      output.setNote(tick, layerToAddNoteTo, newNote);
    }
  }

  return output;
}
