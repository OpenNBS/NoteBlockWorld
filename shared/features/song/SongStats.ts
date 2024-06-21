import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export class SongStats {
  @IsString()
  midiFileName: string;

  @IsInt()
  noteCount: number;

  @IsInt()
  tickCount: number;

  @IsInt()
  layerCount: number;

  @IsNumber()
  tempo: number;

  @IsNumber()
  @ValidateIf((_, value) => value !== null)
  tempoRange: number[] | null;

  @IsNumber()
  timeSignature: number;

  @IsNumber()
  duration: number;

  @IsBoolean()
  loop: boolean;

  @IsInt()
  loopStartTick: number;

  @IsNumber()
  minutesSpent: number;

  @IsInt()
  vanillaInstrumentCount: number;

  @IsInt()
  customInstrumentCount: number;

  @IsBoolean()
  usesCustomInstruments: boolean;

  @IsInt()
  firstCustomInstrumentIndex: number;

  @IsInt()
  notesOutsideOctaveRange: number;

  @IsBoolean()
  compatible: boolean;

  instrumentNoteCounts: number[];
}
