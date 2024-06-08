import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';
import { FeaturedSongsDto } from '@shared/validation/song/dto/FeaturedSongsDto.dtc';
import { SongPreviewDto } from '@shared/validation/song/dto/SongPreview.dto';

import { SongBrowserService } from './song-browser.service';

@Controller('song-browser')
@ApiTags('song-browser')
@ApiTags('song')
export class SongBrowserController {
  constructor(public readonly songBrowserService: SongBrowserService) {}

  @Get('/featured')
  @ApiOperation({ summary: 'Get a list of featured songs' })
  public async getFeaturedSongs(): Promise<FeaturedSongsDto> {
    return await this.songBrowserService.getFeaturedSongs();
  }

  @Get('/recent')
  @ApiOperation({
    summary: 'Get a filtered/sorted list of recent songs with pagination',
  })
  public async getSongList(
    @Query() query: PageQueryDTO,
  ): Promise<SongPreviewDto[]> {
    return await this.songBrowserService.getRecentSongs(query);
  }
}
