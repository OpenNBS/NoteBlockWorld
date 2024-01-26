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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { SongService } from './song.service';
import { PageQuery } from '@server/common/dto/PageQuery.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetSongQueryDto } from './dto/GetSongQuery.dto';
import { UploadSongDto } from './dto/UploadSongDto.dto';
import { DeleteSongDto } from './dto/DeleteSong.dto';
import { SongViewDto } from './dto/SongView.dto';

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
  ): Promise<UploadSongDto[]> {
    return await this.songService.getSongByPage(query);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt-refresh'))
  public async createSong(@Body() body: UploadSongDto): Promise<UploadSongDto> {
    return await this.songService.createSong(body);
  }

  @Patch('/')
  @UseGuards(AuthGuard('jwt-refresh'))
  public async patchSong(
    @Query('id') id: string,
    @Body() body: UploadSongDto,
  ): Promise<UploadSongDto> {
    return await this.songService.patchSong(id, body);
  }

  @Delete('/')
  @UseGuards(AuthGuard('jwt-refresh'))
  public async deleteSong(@Body() body: DeleteSongDto): Promise<UploadSongDto> {
    return await this.songService.deleteSong(body);
  }

  @Post('/upload_song')
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard('jwt-refresh'))
  public async uploadSong(
    @Query('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadSongDto> {
    return await this.songService.uploadSong(id, file);
  }
}
