import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginWithEmailDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    public email: string;
}
