import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { SongPreviewDto } from './dto/SongPreview.dto';
import { SongViewDto } from './dto/SongView.dto';
import { UploadSongDto } from './dto/UploadSongDto.dto';
import { SongService } from './song.service';
import { SongPageDto } from './dto/SongPageDto';
@Controller('song')
@ApiTags('song')
export class SongController {
  constructor(public readonly songService: SongService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get song info' })
  public async getSong(
    @Param('id') id: string,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<SongViewDto> {
    return await this.songService.getSong(id, user);
  }

  @Get('/file')
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

  // @Get('/my')
  // @ApiOperation({
  //   summary: 'Get a list of songs from the authenticated user with pagination',
  // })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt-refresh'))
  // public async getMySongsPage(
  //   @Query() query: PageQuery,
  //   @GetRequestToken() user: UserDocument | null,
  // ): Promise<SongPageDto> {
  //   return await this.songService.getMySongsPage({
  //     query,
  //     user,
  //   });
  // }

  @Post('/')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload Song',
    type: UploadSongDto,
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
    @Body() body: UploadSongDto,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<UploadSongDto> {
    return await this.songService.processUploadedSong({ body, file, user });
  }
}
