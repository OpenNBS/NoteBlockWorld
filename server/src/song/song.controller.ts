import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { PageQuery } from '@server/common/dto/PageQuery.dto';
import { FileService } from '@server/file/file.service';
import { GetRequestToken } from '@server/GetRequestUser';
import { UserDocument } from '@server/user/entity/user.entity';

import { SongPreviewDto } from './dto/SongPreview.dto';
import { SongViewDto } from './dto/SongView.dto';
import { UploadSongDto } from './dto/UploadSongDto.dto';
import { SongService } from './song.service';

// Handles public-facing song routes.

@Controller('song')
@ApiTags('song')
export class SongController {
  static multerConfig: object;

  constructor(
    public readonly songService: SongService,
    public readonly fileService: FileService,
  ) {
    SongController.multerConfig = this.fileService.getMulterConfig();
  }

  @Get('/')
  @ApiOperation({
    summary: 'Get a filtered/sorted list of songs with pagination',
  })
  public async getSongList(
    @Query() query: PageQuery,
  ): Promise<SongPreviewDto[]> {
    return await this.songService.getSongByPage(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get song info by ID' })
  public async getSong(
    @Param('id') id: string,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<SongViewDto> {
    return await this.songService.getSong(id, user);
  }

  @Get('/:id/download')
  @ApiOperation({ summary: 'Get song .nbs file' })
  public async getSongFile(
    @Query('id') id: string,
    @GetRequestToken() user: UserDocument | null,
    @Res() res: Response,
  ): Promise<void> {
    res.set({
      'Content-Disposition': 'attachment; filename="song.nbs"',
    });
    return await this.songService.getSongFile(id, user);
  }

  //@Patch('/:id')
  //@ApiBearerAuth()
  //@UseGuards(AuthGuard('jwt-refresh'))
  //@ApiOperation({ summary: 'Update a song' })
  //public async patchSong(
  //  @Param('id') id: string,
  //  @Body() body: UploadSongDto,
  //  @GetRequestToken() user: UserDocument | null,
  //): Promise<UploadSongDto> {
  //  return await this.songService.patchSong(id, body, user);
  //}
  //
  //@Delete('/:id')
  //@UseGuards(AuthGuard('jwt-refresh'))
  //@ApiBearerAuth()
  //@ApiOperation({ summary: 'Delete a song' })
  //public async deleteSong(@Param('id') id: string): Promise<UploadSongDto> {
  //  return await this.songService.deleteSong(id);
  //}

  @Post('/')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload Song',
    type: UploadSongDto,
  })
  @UseInterceptors(FileInterceptor('file', SongController.multerConfig))
  @ApiOperation({
    summary: 'Upload a .nbs file and send the song data, creating a new song',
  })
  public async createSong(
    @UploadedFile() file: Express.MulterS3.File,
    @Body() body: UploadSongDto,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<UploadSongDto> {
    return await this.songService.processUploadedSong({ body, file, user });
  }
}
