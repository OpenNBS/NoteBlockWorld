import { FeaturedSongsDto, PageQueryDTO, SongPreviewDto } from '@nbw/database';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('song-browser')
@ApiTags('song-browser')
@ApiTags('song')
export class SongBrowserController {
  constructor /*public readonly songBrowserService: SongBrowserService*/() {}

  @Get('/featured')
  @ApiOperation({ summary: 'Get a list of featured songs' })
  public async getFeaturedSongs(): Promise<FeaturedSongsDto> {
    throw new Error('Unimplemented');
    //return await this.songBrowserService.getFeaturedSongs();
  }

  @Get('/recent')
  @ApiOperation({
    summary: 'Get a filtered/sorted list of recent songs with pagination',
  })
  public async getSongList(
    @Query() query: PageQueryDTO,
  ): Promise<SongPreviewDto[]> {
    throw new Error('Unimplemented');
    //return await this.songBrowserService.getRecentSongs(query);
  }

  @Get('/categories')
  @ApiOperation({ summary: 'Get a list of song categories and song counts' })
  public async getCategories(): Promise<Record<string, number>> {
    throw new Error('Unimplemented');
    //return await this.songBrowserService.getCategories();
  }

  @Get('/categories/:id')
  @ApiOperation({ summary: 'Get a list of song categories and song counts' })
  public async getSongsByCategory(
    @Param('id') id: string,
    @Query() query: PageQueryDTO,
  ): Promise<SongPreviewDto[]> {
    throw new Error('Unimplemented');
    //return await this.songBrowserService.getSongsByCategory(id, query);
  }

  @Get('/random')
  @ApiOperation({ summary: 'Get a list of songs at random' })
  public async getRandomSongs(
    @Query('count') count: string,
    @Query('category') category: string,
  ): Promise<SongPreviewDto[]> {
    const countInt = parseInt(count);

    if (isNaN(countInt) || countInt < 1 || countInt > 10) {
      throw new BadRequestException('Invalid query parameters');
    }

    throw new Error('Unimplemented');
    //return await this.songBrowserService.getRandomSongs(countInt, category);
  }
}
