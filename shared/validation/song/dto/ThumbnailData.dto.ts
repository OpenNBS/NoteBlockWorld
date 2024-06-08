import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

import { ThumbnailConst } from '../constants';

export class ThumbnailData {
  @IsNotEmpty()
  @Max(ThumbnailConst.zoomLevel.max)
  @Min(ThumbnailConst.zoomLevel.min)
  @IsInt()
  @ApiProperty({
    description: 'Zoom level of the cover image',
    example: ThumbnailConst.zoomLevel.default,
  })
  zoomLevel: number;

  @IsNotEmpty()
  @Min(0)
  @IsInt()
  @ApiProperty({
    description: 'X position of the cover image',
    example: ThumbnailConst.startTick.default,
  })
  startTick: number;

  @IsNotEmpty()
  @Min(0)
  @ApiProperty({
    description: 'Y position of the cover image',
    example: ThumbnailConst.startLayer.default,
  })
  startLayer: number;

  @IsNotEmpty()
  @IsHexColor()
  @ApiProperty({
    description: 'Background color of the cover image',
    example: ThumbnailConst.backgroundColor.default,
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
