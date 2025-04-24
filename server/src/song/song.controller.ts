import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';
import { UploadConst } from '@shared/validation/song/constants';
import { SongPreviewDto } from '@shared/validation/song/dto/SongPreview.dto';
import { SongViewDto } from '@shared/validation/song/dto/SongView.dto';
import { UploadSongDto } from '@shared/validation/song/dto/UploadSongDto.dto';
import { UploadSongResponseDto } from '@shared/validation/song/dto/UploadSongResponseDto.dto';
import type { Response } from 'express';

import { FileService } from '@server/file/file.service';
import { GetRequestToken, validateUser } from '@server/GetRequestUser';
import type { UserDocument } from '@server/user/entity/user.entity';

import { SongService } from './song.service';

// Handles public-facing song routes.

@Controller('song')
@ApiTags('song')
export class SongController {
  static multerConfig: MulterOptions = {
    limits: {
      fileSize: UploadConst.file.maxSize,
    },
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(nbs)$/)) {
        return cb(new Error('Only .nbs files are allowed!'), false);
      }

      cb(null, true);
    },
  };

  constructor(
    public readonly songService: SongService,
    public readonly fileService: FileService,
  ) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get a filtered/sorted list of songs with pagination',
  })
  public async getSongList(
    @Query() query: PageQueryDTO,
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

  @Get('/:id/edit')
  @ApiOperation({ summary: 'Get song info for editing by ID' })
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  public async getEditSong(
    @Param('id') id: string,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<UploadSongDto> {
    user = validateUser(user);
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
    user = validateUser(user);
    //TODO: Fix this weird type casting and raw body access
    const body = req.body as unknown as UploadSongDto;
    return await this.songService.patchSong(id, body, user);
  }

  @Get('/:id/download')
  @ApiOperation({ summary: 'Get song .nbs file' })
  public async getSongFile(
    @Param('id') id: string,
    @Query('src') src: string,
    @GetRequestToken() user: UserDocument | null,
    @Res() res: Response,
  ): Promise<void> {
    user = validateUser(user);

    // TODO: no longer used
    res.set({
      'Content-Disposition': 'attachment; filename="song.nbs"',
      // Expose the Content-Disposition header to the client
      'Access-Control-Expose-Headers': 'Content-Disposition',
    });

    const url = await this.songService.getSongDownloadUrl(id, user, src, false);
    res.redirect(HttpStatus.FOUND, url);
  }

  @Get('/:id/open')
  @ApiOperation({ summary: 'Get song .nbs file' })
  public async getSongOpenUrl(
    @Param('id') id: string,
    @GetRequestToken() user: UserDocument | null,
    @Headers('src') src: string,
  ): Promise<string> {
    if (src != 'downloadButton') {
      throw new UnauthorizedException('Invalid source');
    }

    const url = await this.songService.getSongDownloadUrl(
      id,
      user,
      'open',
      true,
    );

    return url;
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a song' })
  public async deleteSong(
    @Param('id') id: string,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<void> {
    user = validateUser(user);
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
    user = validateUser(user);
    return await this.songService.uploadSong({ body, file, user });
  }
}
