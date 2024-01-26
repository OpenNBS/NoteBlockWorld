import { IsNotEmpty } from 'class-validator';
export class CustomInstrumentData {
  @IsNotEmpty()
  sound: string[];
}
