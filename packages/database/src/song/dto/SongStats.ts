import {
  IsBoolean,
  IsIn,
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

  @IsInt()
  firstCustomInstrumentIndex: number;

  @IsInt()
  @IsIn([5, 6])
  nbsVersion: number;

  @IsInt()
  defaultInstrumentCount: number;

  @IsInt()
  outOfRangeNoteCount: number;

  @IsInt()
  detunedNoteCount: number;

  @IsInt()
  customInstrumentNoteCount: number;

  @IsInt()
  incompatibleNoteCount: number;

  @IsBoolean()
  compatible: boolean;

  instrumentNoteCounts: number[];
}
