import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
export class GetSongQueryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @IsUUID()
  @ApiProperty({
    description: 'MongoDB ID of the Song',
    example: '5f9d7a3b9d3e4a1b1c9d9d9d',
  })
  id: string;
}
