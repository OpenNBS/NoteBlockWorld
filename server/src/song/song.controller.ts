import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SongService } from './song.service';

@Controller('song')
@ApiTags('song')
export class SongController {
  constructor(public readonly songService: SongService) {}

  @Get('/')
  public async getSong(@Query() query: GetSongQueryDto): Promise<SongDto> {
    try {
      return await this.songService.getSong(query);
    } catch (e) {
      throw e;
    }
  }

  @Get('/page')
  public async getSongByPage(
    @Query() query: GetSongQueryDto,
  ): Promise<SongDto[]> {
    try {
      return await this.songService.getSongByPage(query);
    } catch (e) {
      throw e;
    }
  }

  @Post('/')
  public async createSong(@Body() body: SongDto): Promise<SongDto> {
    try {
      return await this.songService.createSong(body);
    } catch (e) {
      throw e;
    }
  }

  @Patch('/')
  public async patchSong(
    @Query() id: string,
    @Body() body: PatchSongDto,
  ): Promise<SongDto> {
    try {
      return await this.songService.patchSong(id, body);
    } catch (e) {
      throw e;
    }
  }

  @Delete('/')
  public async deleteSong(@Body() body: DeleteSongDto): Promise<SongDto> {
    try {
      return await this.songService.deleteSong(body);
    } catch (e) {
      throw e;
    }
  }
}

class GetSongQueryDto {}
class SongDto {}
class PatchSongDto {}
class DeleteSongDto {}
