import { IsNotEmpty, IsNumberString } from 'class-validator';

export class PageQuery {
  @IsNotEmpty()
  @IsNumberString()
  page: string;

  @IsNotEmpty()
  @IsNumberString()
  limit: string;

  constructor(partial: Partial<PageQuery>) {
    Object.assign(this, partial);
  }
}
