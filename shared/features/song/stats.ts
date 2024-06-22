import { Song } from '@encode42/nbs.js';

import { SongStatsType } from './types';

// Usage:
// SongStatsGenerator.getSongStats(song)

export class SongStatsGenerator {
  public static getSongStats(song: Song) {
    return new SongStatsGenerator(song).toObject();
  }

  private song: Song;
  private stats: SongStatsType;

  private constructor(song: Song) {
    this.song = song;

    const midiFileName = this.getMidiFileName();

    const {
      noteCount,
      tickCount,
      layerCount,
      outOfRangeNoteCount,
      detunedNoteCount,
      customInstrumentNoteCount,
      incompatibleNoteCount,
      instrumentNoteCounts,
    } = this.getCounts();

    const tempoSegments = this.getTempoSegments();

    const tempo = this.getTempo();
    const tempoRange = this.getTempoRange(tempoSegments);
    const timeSignature = this.getTimeSignature();
    const duration = this.getDuration(tempoSegments);
    const loop = this.getLoop();
    const loopStartTick = this.getLoopStartTick();
    const minutesSpent = this.getMinutesSpent();

    const { vanillaInstrumentCount, customInstrumentCount } =
      this.getVanillaAndCustomUsedInstrumentCounts(instrumentNoteCounts);

    const firstCustomInstrumentIndex = this.getFirstCustomInstrumentIndex();

    const compatible = incompatibleNoteCount === 0;

    this.stats = {
      midiFileName,
      noteCount,
      tickCount,
      layerCount,
      tempo,
      tempoRange,
      timeSignature,
      duration,
      loop,
      loopStartTick,
      minutesSpent,
      vanillaInstrumentCount,
      customInstrumentCount,
      firstCustomInstrumentIndex,
      instrumentNoteCounts,
      customInstrumentNoteCount,
      outOfRangeNoteCount,
      detunedNoteCount,
      incompatibleNoteCount,
      compatible,
    };
  }

  private toObject() {
    return this.stats;
  }

  private getMidiFileName(): string {
    return this.song.importName || '';
  }

  private getCounts(): {
    noteCount: number;
    tickCount: number;
    layerCount: number;
    outOfRangeNoteCount: number;
    detunedNoteCount: number;
    customInstrumentNoteCount: number;
    incompatibleNoteCount: number;
    instrumentNoteCounts: number[];
  } {
    let noteCount = 0;
    let tickCount = 0;
    let layerCount = 0;
    let outOfRangeNoteCount = 0;
    let detunedNoteCount = 0;
    let customInstrumentNoteCount = 0;
    let incompatibleNoteCount = 0;
    const instrumentNoteCounts = Array(this.song.instruments.total).fill(0);

    for (const [layerId, layer] of this.song.layers.get.entries()) {
      for (const [tick, note] of layer.notes) {
        if (tick > tickCount) {
          tickCount = tick;
        }

        // The song may store empty layers at the bottom. We actually want the last layer with a note in it
        if (layerId > layerCount) {
          layerCount = layerId;
        }

        const effectivePitch = note.key + note.pitch / 100;

        // Differences between Note Block Studio and this implementation:

        // DETUNED NOTES
        // The behavior here differs from Open Note Block Studio v3.10, since it doesn't consider
        // non-integer/microtonal notes when deciding if a song is compatible. This is likely to
        // change in the future. Since this is relevant to knowing accurately if vanilla note blocks
        // can support the song, NBW uses a more modern approach of counting microtonal notes as
        // outside the 2-octave range - treating it as only the piano keys between 33-57 and not
        // anything in the interval between them.

        // INSTRUMENT PITCH
        // We also use the instrument's original pitch when determining if it's out-of-range.
        // Note Block Studio also doesn't take this into account - since importing custom sounds
        // into the game was out of question back in the legacy versions, we used to only need
        // to worry about vanilla note block compatibility (for schematics).
        // Now that data packs are a thing, out-of-range notes become relevant not only due to
        // note block's key range, but also because the same limit applies to Minecraft's audio
        // engine as a whole (e.g. /playsound etc).
        // But if the instrument's key is not set to F#4 (45), the range supported by Minecraft
        // (without needing to re-pitch the sound externally) also changes (it is always one octave
        // above and below the instrument's key). Note Block Studio doesn't account for this - the
        // supported range is always F#3 to F#5 (33-57) - but we do because it's useful to know if
        // the default Minecraft sounds are enough to play the song (i.e. you can play it using only
        // a custom sounds.json in a resource pack).

        const instrumentKey = this.song.instruments.get[note.instrument].key; // F#4 = 45
        const minRange = 45 - (instrumentKey - 45) - 12; // F#3 = 33
        const maxRange = 45 - (instrumentKey - 45) + 12; // F#5 = 57

        const isOutOfRange =
          effectivePitch < minRange || effectivePitch > maxRange;

        const hasDetune = note.pitch % 100 !== 0;

        const usesCustomInstrument =
          note.instrument >= this.song.instruments.firstCustomIndex;

        if (isOutOfRange) outOfRangeNoteCount++;
        if (hasDetune) detunedNoteCount++;
        if (usesCustomInstrument) customInstrumentNoteCount++;
        if (isOutOfRange || hasDetune || usesCustomInstrument)
          incompatibleNoteCount++;

        instrumentNoteCounts[note.instrument]++;
        noteCount++;
      }
    }

    // Get end of last tick/layer instead of start
    tickCount++;
    layerCount++;

    return {
      noteCount,
      tickCount,
      layerCount,
      outOfRangeNoteCount,
      detunedNoteCount,
      customInstrumentNoteCount,
      incompatibleNoteCount,
      instrumentNoteCounts,
    };
  }

  private getTempo(): number {
    return this.song.tempo;
  }

  private getTempoRange(
    tempoSegments: Record<number, number>,
  ): number[] | null {
    const tempoValues = Object.values(tempoSegments);
    // If song has only the tempo set at the beginning, we have no tempo changes (indicated as null)
    if (tempoValues.length === 1) return null;

    const minTempo = Math.min(...tempoValues);
    const maxTempo = Math.max(...tempoValues);

    return [minTempo, maxTempo];
  }

  private getTempoSegments(): Record<number, number> {
    const tempoSegments: Record<number, number> = {};
    const tempoChangerInstruments = this.getTempoChangerInstrumentIds();

    if (tempoChangerInstruments.length > 0) {
      for (const layer of Array.from(this.song.layers.get).reverse()) {
        for (const [tick, note] of layer.notes) {
          // Not a tempo changer
          if (!tempoChangerInstruments.includes(note.instrument)) continue;

          // The tempo change isn't effective if there's another tempo changer in the same tick,
          // so we iterate layers bottom to top and skip the block if a tempo changer has already
          // been found in this tick
          if (tick in tempoSegments) continue;

          const tempo = Math.abs(note.pitch) / 15; // note pitch = BPM = (t/s) * 15
          tempoSegments[tick] = tempo;
        }
      }
    }

    // If there isn't a tempo changer at tick 0, we add one there to set the starting tempo
    tempoSegments[0] = 0 in tempoSegments ? tempoSegments[0] : this.song.tempo;

    return tempoSegments;
  }

  private getTempoChangerInstrumentIds(): number[] {
    return Object.entries(this.song.instruments.get).flatMap(
      ([id, instrument]) =>
        instrument.name === 'Tempo Changer' ? [parseInt(id)] : [],
    );
  }

  private getTimeSignature(): number {
    return this.song.timeSignature;
  }

  private getDuration(tempoSegments: Record<number, number>): number {
    const tempoChangeTicks = Object.keys(tempoSegments).map((tick) =>
      parseInt(tick),
    );

    tempoChangeTicks.sort((a, b) => a - b);

    let duration = 0;

    // Add end of last tick to close last tempo segment
    const lastTick = this.song.length + 1;

    if (!(lastTick in tempoChangeTicks)) {
      tempoChangeTicks.push(lastTick);
    }

    // Iterate pairs of tempo change ticks and calculate their length
    for (let i = 0; i < tempoChangeTicks.length - 1; i++) {
      const currTick = tempoChangeTicks[i];
      const nextTick = tempoChangeTicks[i + 1];

      const currTempo = tempoSegments[currTick];

      const segmentDurationTicks = nextTick - currTick;
      const timePerTick = 1 / currTempo;

      duration += segmentDurationTicks * timePerTick;
    }

    return duration;
  }

  private getLoop(): boolean {
    return this.song.loop.enabled;
  }

  private getLoopStartTick(): number {
    return this.song.loop.startTick;
  }

  private getMinutesSpent(): number {
    return this.song.minutesSpent;
  }

  private getCustomInstrumentNoteCount(): boolean {
    // Having custom instruments isn't enough, the song must have at least
    //  a note with one of them for it to be considered incompatible

    const lastInstrumentId = this.song.instruments.total - 1; // e.g. 15
    const firstCustomIndex = this.song.instruments.firstCustomIndex; // e.g. 16

    if (lastInstrumentId < firstCustomIndex) {
      return false;
    }

    for (const layer of this.song.layers.get) {
      for (const [_, note] of layer.notes) {
        if (note.instrument >= firstCustomIndex) {
          return true;
        }
      }
    }

    return false;
  }

  private getVanillaAndCustomUsedInstrumentCounts(
    noteCountsPerInstrument: number[],
  ): {
    vanillaInstrumentCount: number;
    customInstrumentCount: number;
  } {
    const firstCustomIndex = this.song.instruments.firstCustomIndex;

    // We want the count of instruments that have at least one note in the song
    // (which tells us how many instruments are effectively used in the song)

    const vanillaInstrumentCount = noteCountsPerInstrument
      .slice(0, firstCustomIndex)
      .filter((count) => count > 0).length;

    const customInstrumentCount = noteCountsPerInstrument
      .slice(firstCustomIndex)
      .filter((count) => count > 0).length;

    return {
      vanillaInstrumentCount,
      customInstrumentCount,
    };
  }

  private getFirstCustomInstrumentIndex(): number {
    return this.song.instruments.firstCustomIndex;
  }
}
