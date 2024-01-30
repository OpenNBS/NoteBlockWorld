import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
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
import { GetRequestToken } from '@server/GetRequestUser';
import { PageQuery } from '@server/common/dto/PageQuery.dto';
import { UserDocument } from '@server/user/entity/user.entity';
import type { Response } from 'express';
import { GetSongQueryDto } from './dto/GetSongQuery.dto';
import { SongDto } from './dto/Song.dto';
import { SongPreviewDto } from './dto/SongPreview.dto';
import { SongViewDto } from './dto/SongView.dto';
import { UploadSongDto } from './dto/UploadSongDto.dto';
import { SongService } from './song.service';
@Controller('song')
@ApiTags('song')
export class SongController {
  constructor(public readonly songService: SongService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get song info' })
  public async getSong(
    @Query() query: GetSongQueryDto,
    @GetRequestToken() user: UserDocument | null,
    @Res() res: Response,
  ): Promise<SongViewDto> {
    const file = await this.songService.getSong(query, user);
    res.set({
      'Content-Type': 'audio/nbs',
      'Content-Disposition': 'attachment; filename="song.nbs"',
    });
    return file;
  }

  @Get('/file')
  @ApiOperation({ summary: 'Get song .nbs file' })
  public async getSongFile(
    @Query('id') id: string,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<StreamableFile> {
    return await this.songService.getSongFile(id, user);
  }

  @Get('/page')
  @ApiOperation({ summary: 'Get song info paginated' })
  public async getSongByPage(
    @Query() query: PageQuery,
  ): Promise<SongPreviewDto[]> {
    return await this.songService.getSongByPage(query);
  }

  @Patch('/')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiOperation({ summary: 'Update a song' })
  public async patchSong(
    @Query('id') id: string,
    @Body() body: UploadSongDto,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<UploadSongDto> {
    return await this.songService.patchSong(id, body, user);
  }

  @Delete('/')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a song' })
  public async deleteSong(@Query('id') id: string): Promise<UploadSongDto> {
    return await this.songService.deleteSong(id);
  }

  //@Post('/')
  //@UseGuards(AuthGuard('jwt-refresh'))
  //@ApiBearerAuth()
  //@ApiOperation({ summary: 'Create a new song' })
  //public async createSong(
  //  @Body() body: UploadSongDto,
  //  @GetRequestToken() user: UserDocument | null,
  //): Promise<SongDto> {
  //  return await this.songService.createSong(body, user);
  //}

  @Post('/')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload Song',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 25, // 25MB
      },
    }),
  )
  @ApiOperation({
    summary: 'Upload a .nbs file and sends the song data, creating a new song',
  })
  public async createSong(
    @UploadedFile() file: Express.Multer.File,
    @Query() body: UploadSongDto,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<UploadSongDto> {
    return await this.songService.uploadSong({ body, file, user });
  }
}
