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
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PageQuery } from '@server/common/dto/PageQuery.dto';
import { User } from '@server/user/entity/user.entity';
import { GetSongQueryDto } from './dto/GetSongQuery.dto';
import { SongPreviewDto } from './dto/SongPreview.dto';
import { SongViewDto } from './dto/SongView.dto';
import { UploadSongDto } from './dto/UploadSongDto.dto';
import { SongService } from './song.service';
import { GetRequestToken } from '@server/GetRequestUser';
import { ParseTokenPipe } from './parseToken';

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
  @ApiBearerAuth()
  @UseGuards(ParseTokenPipe)
  public async createSong(
    @Body() body: UploadSongDto,
    @GetRequestToken() user: any,
  ): Promise<UploadSongDto> {
    return await this.songService.createSong(body);
  }

  @Patch('/')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-refresh'))
  public async patchSong(
    @Query('id') id: string,
    @Body() body: UploadSongDto,
  ): Promise<UploadSongDto> {
    return await this.songService.patchSong(id, body);
  }

  @Delete('/')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  public async deleteSong(@Query('id') id: string): Promise<UploadSongDto> {
    return await this.songService.deleteSong(id);
  }

  @Post('/upload_song')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadSong(
    @Query('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadSongDto> {
    return await this.songService.uploadSong(id, file);
  }
}
