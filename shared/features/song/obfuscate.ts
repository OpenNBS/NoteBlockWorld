import { Instrument, Layer, Note, Song } from '@encode42/nbs.js';

import { getInstrumentNoteCounts, getTempoChangerInstrumentIds } from './util';

export class SongObfuscator {
  private song: Song;
  private soundPaths: string[];
  private output: Song;

  public static obfuscateSong(song: Song, soundPaths: string[]) {
    return new SongObfuscator(song, soundPaths).output;
  }

  private constructor(song: Song, soundPaths: string[]) {
    this.song = song;
    this.soundPaths = soundPaths;
    this.output = this.generateObfuscatedSong();
  }

  private generateObfuscatedSong(): Song {
    const song = this.song;
    const output = new Song();

    // ✅ Clear work stats
    // ✅ Copy: title, author, description, loop info, time signature
    this.copyMetaAndStats(song, output);
    const instrumentMapping = this.resolveInstruments(song, output);
    this.resolveNotes(song, output, instrumentMapping);

    return output;
  }

  private copyMetaAndStats(song: Song, output: Song) {
    output.meta.name = song.meta.name;
    output.meta.author = song.meta.author;
    output.meta.originalAuthor = song.meta.originalAuthor;
    output.meta.description = song.meta.description;
    output.meta.importName = song.meta.importName;

    output.loop.enabled = song.loop.enabled;
    output.loop.startTick = song.loop.startTick;
    output.loop.totalLoops = song.loop.totalLoops;

    output.tempo = song.tempo;
    output.timeSignature = song.timeSignature;
  }

  private resolveInstruments(song: Song, output: Song): Record<number, number> {
    // ✅ Remove unused instruments
    // ✅ Remove instrument info (name, press) - keep sound hash and pitch

    const noteCountPerInstrument = getInstrumentNoteCounts(song);

    const instrumentMapping: Record<number, number> = {};

    for (const [
      instrumentId,
      instrument,
    ] of song.instruments.loaded.entries()) {
      if (instrument.builtIn) {
        instrumentMapping[instrumentId] = instrumentId;
        continue;
      }

      // Remove unused instruments (no notes or no sound defined)
      const instrumentName = instrument.meta.name;
      const customId = instrumentId - output.instruments.firstCustomIndex;
      const soundFilePath = this.soundPaths[customId];
      const isTempoChanger = instrument.meta.name === 'Tempo Changer';

      if (
        !isTempoChanger &&
        (noteCountPerInstrument[instrumentId] === 0 || soundFilePath === '')
      ) {
        console.log(
          `Skipping instrument '${instrumentName}' with ${noteCountPerInstrument[instrumentId]}`,
          `notes and sound file '${soundFilePath}' (custom ID: ${customId})`,
        );

        continue;
      }

      // Remove instrument info
      const newInstrumentId = output.instruments.loaded.length;
      const newCustomId = newInstrumentId - output.instruments.firstCustomIndex;

      console.log(
        `Keeping instrument '${instrumentName}' with`,
        `${noteCountPerInstrument[instrumentId]} notes and sound file`,
        `'${this.soundPaths[customId]}' (custom ID: ${customId} -> ${newCustomId})`,
      );

      const newInstrument = new Instrument(newInstrumentId, {
        name: instrumentName === 'Tempo Changer' ? 'Tempo Changer' : '',
        soundFile: soundFilePath,
        key: instrument.key,
        pressKey: false,
      });

      output.instruments.loaded.push(newInstrument);
      instrumentMapping[instrumentId] = newInstrumentId;
    }

    return instrumentMapping;
  }

  private resolveNotes(
    song: Song,
    output: Song,
    instrumentMapping: Record<number, number>,
  ) {
    // ✅ Pile notes at the top
    // ✅ Bake layer volume into note velocity
    // ✅ Bake layer pan into note pan
    // ✅ Flatten note key and pitch
    // ✅ Remove silent notes (except Tempo Changers)
    // ✅ Remove everything in locked layers
    // ✅ Remove all layer info (name, volume, panning)

    const resolveKeyAndPitch = (note: Note) => {
      const factoredPitch = note.key * 100 + note.pitch;

      let key, pitch;

      // TODO: add regression test for this behavior
      if (factoredPitch < 0) {
        // Below A0
        key = 0;
        pitch = factoredPitch;
      } else if (factoredPitch >= 87 * 100) {
        // Above C8
        key = 87;
        pitch = factoredPitch - 87 * 100;
      } else {
        key = Math.floor((factoredPitch + 50) / 100);
        pitch = ((factoredPitch + 50) % 100) - 50;
      }

      return { key, pitch };
    };

    const resolveInstrument = (note: Note) =>
      instrumentMapping[note.instrument];

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

      let layerIdToAddNoteTo = lastLayerInTick.get(tick);

      if (layerIdToAddNoteTo === undefined) {
        layerIdToAddNoteTo = 0;
      }

      lastLayerInTick.set(tick, layerIdToAddNoteTo + 1);

      const layerToAddNoteTo =
        output.layers[layerIdToAddNoteTo] || output.createLayer();

      output.setNote(tick, layerToAddNoteTo, note);
    };

    const tempoChangerIds = getTempoChangerInstrumentIds(song);
    const lastLayerInTick = new Map<number, number>();

    for (const layer of song.layers) {
      // Skip locked and silent layers
      if (layer.isLocked || layer.volume === 0) {
        continue;
      }

      for (const tickStr in layer.notes) {
        const note = layer.notes[tickStr];
        const tick = parseInt(tickStr);

        // Skip silent notes except if they are tempo changers
        const isTempoChanger = tempoChangerIds.includes(note.instrument);
        if (note.velocity === 0 && !isTempoChanger) continue;

        // Skip notes with deleted instruments
        if (instrumentMapping[note.instrument] === undefined) continue;

        // Add obfuscated note to output
        const newNote = getObfuscatedNote(note, layer);
        if (isTempoChanger) newNote.pitch = note.pitch;
        addNoteToOutput(tick, newNote);
      }
    }
  }
}
