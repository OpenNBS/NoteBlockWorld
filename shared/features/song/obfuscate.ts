import { Instrument, Layer, Note, Song } from '@encode42/nbs.js';

import { getInstrumentNoteCounts, getTempoChangerInstrumentIds } from './util';

export class SongObfuscator {
  private song: Song;
  private output: Song;

  public static obfuscateSong(song: Song) {
    return new SongObfuscator(song).song;
  }

  private constructor(song: Song) {
    this.song = song;
    this.output = this.generateObfuscatedSong();
  }

  private generateObfuscatedSong(): Song {
    const song = this.song;
    const output = new Song();

    const tempoChangerIds = getTempoChangerInstrumentIds(song);

    // ✅ Clear work stats
    // ✅ Copy: title, author, description, loop info, time signature
    this.copyMetaAndStats(song, output);
    this.processInstruments(tempoChangerIds);
    this.processNotes(tempoChangerIds);

    return output;
  }

  private copyMetaAndStats(song: Song, output: Song) {
    output.meta.name = song.meta.name;
    output.meta.author = song.meta.author;
    output.meta.description = song.meta.description;

    output.loop.enabled = song.loop.enabled;
    output.loop.startTick = song.loop.startTick;
    output.loop.totalLoops = song.loop.totalLoops;

    output.tempo = song.tempo;
    output.timeSignature = song.timeSignature;
  }

  private processInstruments(tempoChangerIds: number[]) {
    // TODO: Remove unused instruments
    // TODO: Remove instrument info (name, press) - keep sound hash and pitch

    const noteCountPerInstrument = getInstrumentNoteCounts(this.song);

    const instrumentMapping: Record<number, number> = {};

    for (const [
      instrumentId,
      instrument,
    ] of this.song.instruments.loaded.entries()) {
      if (instrument.builtIn) {
        continue;
      }

      // Remove unused instruments
      if (noteCountPerInstrument[instrumentId] === 0) {
        continue;
      }

      // Ignore tempo changers (handled later)
      if (tempoChangerIds.includes(instrumentId)) {
        continue;
      }

      // Remove instrument info
      const newInstrumentId = this.output.instruments.loaded.length;

      const newInstrument = new Instrument(newInstrumentId, {
        name: '',
        soundFile: 'hash.ogg', // TODO: grab from sounds submitted in upload form
        key: instrument.key,
        pressKey: false,
      });

      this.output.instruments.loaded.push(newInstrument);
      instrumentMapping[instrumentId] = newInstrumentId;
    }

    if (tempoChangerIds.length === 0) return;

    // Handle tempo changers
    const newTempoChangerId = this.output.instruments.loaded.length;

    const newTempoChanger = new Instrument(newTempoChangerId, {
      name: 'Tempo Changer',
      soundFile: '',
      key: 45,
      pressKey: false,
    });

    this.output.instruments.loaded.push(newTempoChanger);

    for (const id of tempoChangerIds) {
      instrumentMapping[id] = newTempoChangerId;
    }
  }

  private processNotes(tempoChangerIds: number[]) {
    // ✅ Pile notes at the top
    // ✅ Bake layer volume into note velocity
    // ✅ Bake layer pan into note pan
    // ✅ Flatten note key and pitch
    // ✅ Remove silent notes (except Tempo Changers)
    // ✅ Remove everything in locked layers
    // ✅ Remove all layer info (name, volume, panning)

    const resolveKeyAndPitch = (note: Note) => {
      const factoredPitch = note.key * 100 + note.pitch;
      const key = factoredPitch / 100;
      const pitch = factoredPitch % 100;

      return { key, pitch };
    };

    const resolveInstrument = (note: Note) => {
      let instrumentId;

      if (note.instrument < this.song.instruments.firstCustomIndex) {
        instrumentId = note.instrument;
      } else {
        // TODO: instrument = instrumentMapping[note.instrument];
      }

      return instrumentId;
    };

    const resolveVelocity = (note: Note, layer: Layer) => {
      let velocity = ((note.velocity / 100) * layer.volume) / 100;
      velocity = Math.round(velocity * 100);

      return velocity;
    };

    const resolvePanning = (note: Note, layer: Layer) => {
      let panning;

      if (layer.stereo === 0) {
        panning = note.panning;
      } else {
        panning = (note.panning + layer.stereo) / 2;
      }

      return panning;
    };

    const getObfuscatedNote = (note: Note, layer: Layer) => {
      const { key, pitch } = resolveKeyAndPitch(note);
      const instrument = resolveInstrument(note);
      const velocity = resolveVelocity(note, layer);
      const panning = resolvePanning(note, layer);

      // Create new note
      const newNote = new Note(instrument, {
        key,
        velocity,
        panning,
        pitch,
      });

      return newNote;
    };

    const addNoteToOutput = (tick: number, note: Note) => {
      // Adds a note at tick at the first row that does not have a note yet

      const output = this.output;

      let layerIdToAddNoteTo = lastLayerInTick.get(tick);

      if (layerIdToAddNoteTo === undefined) {
        layerIdToAddNoteTo = 0;
      }

      lastLayerInTick.set(tick, layerIdToAddNoteTo + 1);

      const layerToAddNoteTo =
        this.output.layers[layerIdToAddNoteTo] || output.createLayer();

      this.output.setNote(tick, layerToAddNoteTo, note);
    };

    const lastLayerInTick = new Map<number, number>();

    for (const layer of this.song.layers) {
      // Skip locked and silent layers
      if (layer.isLocked || layer.volume === 0) {
        continue;
      }

      for (const tickStr in layer.notes) {
        const note = layer.notes[tickStr];
        const tick = parseInt(tickStr);

        // Skip silent notes except if they are tempo changers
        const isTempoChanger = tempoChangerIds.includes(note.instrument); // TODO: doesn't work yet
        if (note.velocity === 0 && !isTempoChanger) continue;

        // Add obfuscated note to output
        const newNote = getObfuscatedNote(note, layer);
        addNoteToOutput(tick, newNote);
      }
    }
  }
}
