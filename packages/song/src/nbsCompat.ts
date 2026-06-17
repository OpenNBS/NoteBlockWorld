import {
  fromArrayBuffer,
  Instrument,
  Song,
  type FromArrayBufferOptions,
} from '@encode42/nbs.js';

/** Default instruments 0–15 (NBS v5 and below). */
export const NBS_V5_FIRST_CUSTOM = 16;

/** First custom instrument index in NBS v6. */
export const NBS_V6_FIRST_CUSTOM = 20;

export const MAX_SUPPORTED_NBS_VERSION = 6;

export class UnsupportedNbsVersionError extends Error {
  constructor(public readonly version: number) {
    super(
      `Unsupported NBS version: ${version}. Maximum supported version is ${MAX_SUPPORTED_NBS_VERSION}.`,
    );
    this.name = 'UnsupportedNbsVersionError';
  }
}

// TODO: TEMP: Remove when @encode42/nbs.js ships v6 built-in instruments in Instrument.builtIn.
const NBS_V6_BUILTIN_INSTRUMENTS: Instrument[] = [
  new Instrument(16, {
    name: 'Trumpet',
    soundFile: 'trumpet.ogg',
    builtIn: true,
    key: 45,
  }),
  new Instrument(17, {
    name: 'Exposed Trumpet',
    soundFile: 'exposed_trumpet.ogg',
    builtIn: true,
    key: 45,
  }),
  new Instrument(18, {
    name: 'Weathered Trumpet',
    soundFile: 'weathered_trumpet.ogg',
    builtIn: true,
    key: 45,
  }),
  new Instrument(19, {
    name: 'Oxidized Trumpet',
    soundFile: 'oxidized_trumpet.ogg',
    builtIn: true,
    key: 45,
  }),
];

export function getNbsFormatVersion(song: Song): 5 | 6 {
  return song.nbsVersion >= 6 ? 6 : 5;
}

export function isNbsV6(song: Song): boolean {
  return getNbsFormatVersion(song) === 6;
}

function findInstrumentById(song: Song, id: number): Instrument | undefined {
  const { loaded } = song.instruments;

  if (loaded[id]?.id === id) {
    return loaded[id];
  }

  return loaded.find((inst) => inst?.id === id);
}

function cloneBuiltinInstrument(
  source: Instrument | undefined,
  fallback: Instrument,
  id: number,
): Instrument {
  const base = source ?? fallback;

  return new Instrument(id, {
    name: base.meta.name,
    soundFile: base.meta.soundFile,
    key: base.key,
    pressKey: base.pressKey,
    builtIn: true,
  });
}

function getDefaultBuiltinInstrument(id: number): Instrument {
  if (id < Instrument.builtIn.length) {
    return Instrument.builtIn[id]!;
  }

  return NBS_V6_BUILTIN_INSTRUMENTS[id - NBS_V5_FIRST_CUSTOM]!;
}

/**
 * Rebuilds `instruments.loaded` so array indices match note instrument IDs.
 * nbs.js 5.0.2 leaves gaps at 16–19 for v6 files and may place customs at wrong indices.
 *
 * // TODO: TEMP: Remove when @encode42/nbs.js natively models v6.
 */
export function normalizeNbsSong(song: Song): Song {
  if (song.nbsVersion > MAX_SUPPORTED_NBS_VERSION) {
    throw new UnsupportedNbsVersionError(song.nbsVersion);
  }

  if (!isNbsV6(song)) {
    return song;
  }

  const firstCustom = song.instruments.firstCustomIndex;
  const newLoaded: Instrument[] = [];

  for (let id = 0; id < firstCustom; id++) {
    newLoaded[id] = cloneBuiltinInstrument(
      findInstrumentById(song, id),
      getDefaultBuiltinInstrument(id),
      id,
    );
  }

  const customs = song.instruments.loaded.filter(
    (inst): inst is Instrument => Boolean(inst) && !inst.builtIn,
  );

  customs.sort((a, b) => a.id - b.id);

  for (const inst of customs) {
    const targetId =
      inst.id >= firstCustom ? inst.id : firstCustom + customs.indexOf(inst);

    newLoaded[targetId] = inst;
  }

  song.instruments.loaded = newLoaded;

  return song;
}

/**
 * Seeds obfuscated output with the source song's format version and built-in instruments.
 *
 * TODO: TEMP: Remove when @encode42/nbs.js creates v6 songs from `new Song()`.
 */
export function seedOutputBuiltinInstruments(source: Song, output: Song): void {
  output.nbsVersion = getNbsFormatVersion(source);
  output.instruments.firstCustomIndex = source.instruments.firstCustomIndex;

  const firstCustom = source.instruments.firstCustomIndex;
  const builtins: Instrument[] = [];

  for (let id = 0; id < firstCustom; id++) {
    builtins[id] = cloneBuiltinInstrument(
      findInstrumentById(source, id),
      getDefaultBuiltinInstrument(id),
      id,
    );
  }

  output.instruments.loaded = builtins;
}

export function loadNbsFromBuffer(
  buffer: ArrayBuffer,
  options?: FromArrayBufferOptions,
): Song {
  const song = fromArrayBuffer(buffer, options);

  if (song.nbsVersion > MAX_SUPPORTED_NBS_VERSION) {
    throw new UnsupportedNbsVersionError(song.nbsVersion);
  }

  return normalizeNbsSong(song);
}
