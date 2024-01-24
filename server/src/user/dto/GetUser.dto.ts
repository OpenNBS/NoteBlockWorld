import {
  IsString,
  MaxLength,
  IsEmail,
  MinLength,
  IsMongoId,
} from 'class-validator';

export class GetUser {
  @IsString()
  @MaxLength(64)
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(64)
  username: string;

  @IsString()
  @MaxLength(64)
  @MinLength(24)
  @IsMongoId()
  id: string;

  constructor(partial: Partial<GetUser>) {
    Object.assign(this, partial);
  }
}
