import { Song } from '@encode42/nbs.js';

import { SongStatsType } from './types';

export class SongStats {
  private song: Song;
  private stats: Partial<SongStatsType> = {};

  constructor(song: Song) {
    this.song = song;

    this.stats.midiFileName = this.getMidiFileName();

    const {
      noteCount,
      tickCount,
      layerCount,
      notesOutsideOctaveRange,
      instrumentNoteCounts,
    } = this.getCounts();

    this.stats.noteCount = noteCount;
    this.stats.tickCount = tickCount;
    this.stats.layerCount = layerCount;
    this.stats.tempo = this.getTempo();
    this.stats.tempoRange = this.getTempoRange();
    this.stats.timeSignature = this.getTimeSignature();
    this.stats.duration = this.getDuration();
    this.stats.loop = this.getLoop();
    this.stats.loopStartTick = this.getLoopStartTick();
    this.stats.minutesSpent = this.getMinutesSpent();
    this.stats.usesCustomInstruments = this.getUsesCustomInstruments();
    this.stats.notesOutsideOctaveRange = notesOutsideOctaveRange;
    this.stats.instrumentNoteCounts = instrumentNoteCounts;
  }

  public toObject() {
    return this.stats;
  }

  private getMidiFileName(): string {
    return this.song.importName;
  }

  private getCounts(): {
    noteCount: number;
    tickCount: number;
    layerCount: number;
    notesOutsideOctaveRange: number;
    instrumentNoteCounts: number[];
  } {
    let noteCount = 0;
    let tickCount = 0;
    let layerCount = 0;
    let notesOutsideOctaveRange = 0;
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

        if (note.key < 33 || note.key > 57) {
          notesOutsideOctaveRange++;
        }

        instrumentNoteCounts[note.instrument]++;
        noteCount++;
      }
    }

    return {
      noteCount,
      tickCount,
      layerCount,
      notesOutsideOctaveRange,
      instrumentNoteCounts,
    };
  }

  private getTempo(): number {
    return this.song.tempo;
  }

  private getTempoRange(): number[] | null {
    const tempoValues = Object.values(this.getTempoSegments());
    if (tempoValues.length === 0) return null;

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

          const tempo = note.pitch / 15; // note pitch = BPM = (t/s) * 15
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

  private getDuration(): number {
    const tempoSegments = this.getTempoSegments();

    const tempoChangeTicks = Object.keys(tempoSegments)
      .map((tick) => parseInt(tick))
      .toSorted();

    let duration = 0;

    // Add last tick to close last tempo segment
    const lastTick = this.song.length - 1;

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

  private getUsesCustomInstruments(): boolean {
    // Having custom instruments isn't enough, the song must have at least a note with one of them
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
}

// Usage:
// const stats = new SongStats(song).toObject()
