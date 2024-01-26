import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { PageQuery } from '@server/common/dto/PageQuery.dto';
import { GetSongQueryDto } from './dto/GetSongQuery.dto';
import { SongPreviewDto } from './dto/SongPreview.dto';
import { SongViewDto } from './dto/SongView.dto';
import { UploadSongDto } from './dto/UploadSongDto.dto';
import { SongService } from './song.service';

@Controller('song')
@ApiTags('song')
export class SongController {
  constructor(public readonly songService: SongService) {}

  @Get('/')
  public async getSong(@Query() query: GetSongQueryDto): Promise<SongViewDto> {
    return await this.songService.getSong(query);
  }

  @Get('/page')
  public async getSongByPage(
    @Query() query: PageQuery,
  ): Promise<SongPreviewDto[]> {
    return await this.songService.getSongByPage(query);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiCookieAuth('token')
  public async createSong(@Body() body: UploadSongDto): Promise<UploadSongDto> {
    return await this.songService.createSong(body);
  }

  @Patch('/')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiCookieAuth('token')
  public async patchSong(
    @Query('id') id: string,
    @Body() body: UploadSongDto,
  ): Promise<UploadSongDto> {
    return await this.songService.patchSong(id, body);
  }

  @Delete('/')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiCookieAuth('token')
  public async deleteSong(@Query('id') id: string): Promise<UploadSongDto> {
    return await this.songService.deleteSong(id);
  }

  @Post('/upload_song')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiCookieAuth('token')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadSong(
    @Query('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadSongDto> {
    return await this.songService.uploadSong(id, file);
  }
}
