import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  RawBodyRequest,
  Req,
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
import { SongPreviewDto } from '@shared/validation/song/dto/SongPreview.dto';
import { SongViewDto } from '@shared/validation/song/dto/SongView.dto';
import { UploadSongDto } from '@shared/validation/song/dto/UploadSongDto.dto';
import { UploadSongResponseDto } from '@shared/validation/song/dto/UploadSongResponseDto.dto';
import type { Response } from 'express';

import { PageQuery } from '@server/common/dto/PageQuery.dto';
import { FileService } from '@server/file/file.service';
import { GetRequestToken } from '@server/GetRequestUser';
import { UserDocument } from '@server/user/entity/user.entity';

import { SongService } from './song.service';

// Handles public-facing song routes.

@Controller('song')
@ApiTags('song')
export class SongController {
  static multerConfig: object;

  constructor(
    public readonly songService: SongService,
    public readonly fileService: FileService,
  ) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get a filtered/sorted list of songs with pagination',
  })
  public async getSongList(
    @Query() query: PageQuery,
  ): Promise<SongPreviewDto[]> {
    // TODO: rename DTOs to SongPreviewRequestDto and SongPreviewResponseDto
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

  @Get('/:id/edit')
  @ApiOperation({ summary: 'Get song info for editing by ID' })
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  public async getEditSong(
    @Param('id') id: string,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<UploadSongDto> {
    return await this.songService.getSongEdit(id, user);
  }

  @Patch('/:id/edit')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edit song info by ID' })
  @ApiBody({
    description: 'Upload Song',
    type: UploadSongResponseDto,
  })
  public async patchSong(
    @Param('id') id: string,
    @Req() req: RawBodyRequest<Request>,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<UploadSongResponseDto> {
    //TODO: Fix this weird type casting and raw body access
    const body = req.body as unknown as UploadSongDto;
    return await this.songService.patchSong(id, body, user);
  }

  @Get('/:id/download')
  @ApiOperation({ summary: 'Get song .nbs file' })
  public async getSongFile(
    @Param('id') id: string,
    @GetRequestToken() user: UserDocument | null,
    @Res() res: Response,
  ): Promise<void> {
    res.set({
      'Content-Disposition': 'attachment; filename="song.nbs"',
    });
    const url = await this.songService.getSongDownloadUrl(id, user);
    res.redirect(HttpStatus.TEMPORARY_REDIRECT, url);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a song' })
  public async deleteSong(
    @Param('id') id: string,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<void> {
    await this.songService.deleteSong(id, user);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload Song',
    type: UploadSongResponseDto,
  })
  @UseInterceptors(FileInterceptor('file', SongController.multerConfig))
  @ApiOperation({
    summary: 'Upload a .nbs file and send the song data, creating a new song',
  })
  public async createSong(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadSongDto,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<UploadSongResponseDto> {
    return await this.songService.processUploadedSong({ body, file, user });
  }
}
