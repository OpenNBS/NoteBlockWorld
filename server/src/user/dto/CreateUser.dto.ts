import { MaxLength, IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateUser {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  username: string;

  constructor(partial: Partial<CreateUser>) {
    Object.assign(this, partial);
  }
}
