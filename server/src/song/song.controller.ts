import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { SongService } from './song.service';
import {
  GetSongQueryDto,
  SongDto,
  PatchSongDto,
  DeleteSongDto,
} from './dto/index';
import { PageQuery } from '@server/common/dto/PageQuery.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('song')
@ApiTags('song')
export class SongController {
  constructor(public readonly songService: SongService) {}

  @Get('/')
  public async getSong(@Query() query: GetSongQueryDto): Promise<SongDto> {
    return await this.songService.getSong(query);
  }

  @Get('/page')
  public async getSongByPage(@Query() query: PageQuery): Promise<SongDto[]> {
    return await this.songService.getSongByPage(query);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt-refresh'))
  public async createSong(@Body() body: SongDto): Promise<SongDto> {
    return await this.songService.createSong(body);
  }

  @Patch('/')
  @UseGuards(AuthGuard('jwt-refresh'))
  public async patchSong(@Body() body: PatchSongDto): Promise<SongDto> {
    return await this.songService.patchSong(body);
  }

  @Delete('/')
  @UseGuards(AuthGuard('jwt-refresh'))
  public async deleteSong(@Body() body: DeleteSongDto): Promise<SongDto> {
    return await this.songService.deleteSong(body);
  }

  @Post('/upload_song')
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard('jwt-refresh'))
  public async uploadSong(
    @Query('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SongDto> {
    return await this.songService.uploadSong(id, file);
  }

  @Get('/verify-song-name')
  @UseGuards(AuthGuard('jwt-refresh'))
  public async verifySongName(@Query('name') name: string): Promise<boolean> {
    return await this.songService.verifySongName(name);
  }
}
