import { Song } from '@encode42/nbs.js';

import { SongStatsType } from './types';

export class SongStats {
  private song: Song;
  private stats: SongStatsType;

  constructor(song: Song) {
    this.song = song;

    this.stats.fileSize = this.getFileSize();
    this.stats.midiFileName = this.getMidiFileName();
    this.stats.noteCount = this.getNoteCount();
    this.stats.tickCount = this.getTickCount();
    this.stats.layerCount = this.getLayerCount();
    this.stats.tempo = this.getTempo();
    this.stats.tempoRange = this.getTempoRange();
    this.stats.timeSignature = this.getTimeSignature();
    this.stats.duration = this.getDuration();
    this.stats.loop = this.getLoop();
    this.stats.loopStartTick = this.getLoopStartTick();
    this.stats.minutesSpent = this.getMinutesSpent();
    this.stats.usesCustomInstruments = this.getUsesCustomInstruments();
    this.stats.isInOctaveRange = this.getIsInOctaveRange();
    this.stats.compatible = this.getCompatible();
    this.stats.instrumentCounts = this.getInstrumentCounts();
  }

  public toObject() {
    return this.stats;
  }

  private getFileSize(): number {
    throw new Error('Method not implemented.');
  }

  private getMidiFileName(): string {
    throw new Error('Method not implemented.');
  }

  private getNoteCount(): number {
    throw new Error('Method not implemented.');
  }

  private getTickCount(): number {
    throw new Error('Method not implemented.');
  }

  private getLayerCount(): number {
    throw new Error('Method not implemented.');
  }

  private getTempo(): number {
    throw new Error('Method not implemented.');
  }

  private getTempoRange(): number[] {
    throw new Error('Method not implemented.');
  }

  private getTimeSignature(): number {
    throw new Error('Method not implemented.');
  }

  private getDuration(): number {
    throw new Error('Method not implemented.');
  }

  private getLoop(): boolean {
    throw new Error('Method not implemented.');
  }

  private getLoopStartTick(): number {
    throw new Error('Method not implemented.');
  }

  private getMinutesSpent(): number {
    throw new Error('Method not implemented.');
  }

  private getUsesCustomInstruments(): boolean {
    throw new Error('Method not implemented.');
  }

  private getIsInOctaveRange(): boolean {
    throw new Error('Method not implemented.');
  }

  private getCompatible(): boolean {
    throw new Error('Method not implemented.');
  }

  private getInstrumentCounts(): number[] {
    throw new Error('Method not implemented.');
  }
}

// Usage:
// const stats = new SongStats(song).toObject()
