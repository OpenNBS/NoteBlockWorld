import { THUMBNAIL_CONSTANTS } from '@nbw/config';
import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class ThumbnailData {
  @IsNotEmpty()
  @Max(THUMBNAIL_CONSTANTS.zoomLevel.max)
  @Min(THUMBNAIL_CONSTANTS.zoomLevel.min)
  @IsInt()
  @ApiProperty({
    description: 'Zoom level of the cover image',
    example: THUMBNAIL_CONSTANTS.zoomLevel.default,
  })
  zoomLevel: number;

  @IsNotEmpty()
  @Min(0)
  @IsInt()
  @ApiProperty({
    description: 'X position of the cover image',
    example: THUMBNAIL_CONSTANTS.startTick.default,
  })
  startTick: number;

  @IsNotEmpty()
  @Min(0)
  @ApiProperty({
    description: 'Y position of the cover image',
    example: THUMBNAIL_CONSTANTS.startLayer.default,
  })
  startLayer: number;

  @IsNotEmpty()
  @IsHexColor()
  @ApiProperty({
    description: 'Background color of the cover image',
    example: THUMBNAIL_CONSTANTS.backgroundColor.default,
  })
  backgroundColor: string;

  static getApiExample(): ThumbnailData {
    return {
      zoomLevel: 3,
      startTick: 0,
      startLayer: 0,
      backgroundColor: '#F0F0F0',
    };
  }
}
