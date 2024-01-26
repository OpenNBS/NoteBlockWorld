import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, Min, IsInt, IsHexColor } from 'class-validator';
export class CoverData {
  @IsNotEmpty()
  @Max(5)
  @Min(1)
  @IsInt()
  @ApiProperty({
    description: 'Zoom level of the cover image',
    example: 3,
  })
  zoomLevel: number;

  @IsNotEmpty()
  @Min(0)
  @IsInt()
  @ApiProperty({
    description: 'X position of the cover image',
    example: 0,
  })
  startTick: number;

  @IsNotEmpty()
  @Min(0)
  @ApiProperty({
    description: 'Y position of the cover image',
    example: 0,
  })
  startLayer: number;

  @IsNotEmpty()
  @IsHexColor()
  @ApiProperty({
    description: 'Background color of the cover image',
    example: '#F0F0F0',
  })
  backgroundColor: string;

  static getApiExample(): CoverData {
    return {
      zoomLevel: 3,
      startTick: 0,
      startLayer: 0,
      backgroundColor: '#F0F0F0',
    };
  }
}
