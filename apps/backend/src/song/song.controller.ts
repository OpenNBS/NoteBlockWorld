import type { RawBodyRequest } from '@nestjs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Inject,
  Logger,
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
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { BROWSER_SONGS, TIMESPANS, UPLOAD_CONSTANTS } from '@nbw/config';
import type { SongWithUser, UserDocument } from '@nbw/database';
import {
  createFeaturedSongsDto,
  type FeaturedSongsDto,
  type PageDto,
  type PageQueryInput,
  type SongPreviewDto,
  SongSortType,
  type SongViewDto,
  type TimespanType,
  type UploadSongDto,
  type UploadSongResponseDto,
} from '@nbw/validation';
import { FileService } from '@server/file/file.service';
import { GetRequestToken, validateUser } from '@server/lib/GetRequestUser';
import {
  SongFileQueryDto,
  SongIdParamDto,
  SongListQueryDto,
  SongOpenHeadersDto,
  SongSearchQueryDto,
  UploadSongBodyDto,
} from '@server/zod-dto';

import { SongService } from './song.service';
import { songPreviewFromSongDocumentWithUser } from './song.util';

@Controller('song')
@ApiTags('song')
export class SongController {
  private logger = new Logger(SongController.name);
  static multerConfig: MulterOptions = {
    limits: { fileSize: UPLOAD_CONSTANTS.file.maxSize },
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(nbs)$/))
        return cb(new Error('Only .nbs files are allowed!'), false);
      cb(null, true);
    },
  };

  constructor(
    @Inject(SongService)
    public readonly songService: SongService,
    @Inject(FileService)
    public readonly fileService: FileService,
  ) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get songs with filtering and sorting options',
    description: `
      Retrieves songs based on the provided query parameters.
      
      **Query Parameters:**
      - \`q\`: Search string to filter songs by title or description (optional)
      - \`sort\`: Sort songs by criteria (recent, random, playCount, title, duration, noteCount)
      - \`order\`: Sort order (asc, desc) - only applies if sort is not random
      - \`category\`: Filter by category - if left empty, returns songs in any category
      - \`uploader\`: Filter by uploader username - if provided, will only return songs uploaded by that user
      - \`page\`: Page number (default: 1)
      - \`limit\`: Number of items to return per page (default: 10)
      
      **Return Type:**
      - PageDto<SongPreviewDto>: Paginated list of song previews
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Success. Returns paginated list of song previews.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid query parameters.',
  })
  public async getSongList(
    @Query() query: SongListQueryDto,
  ): Promise<PageDto<SongPreviewDto>> {
    // Handle random sort
    if (query.sort === SongSortType.RANDOM) {
      const data = await this.songService.getRandomSongs(
        query.limit ?? 1,
        query.category,
      );

      return {
        content: data,
        page: query.page,
        limit: query.limit,
        total: data.length,
        order: true,
      };
    }

    // Map sort types to MongoDB field paths
    const sortFieldMap = new Map<SongSortType, string>([
      [SongSortType.RECENT, 'createdAt'],
      [SongSortType.PLAY_COUNT, 'playCount'],
      [SongSortType.TITLE, 'title'],
      [SongSortType.DURATION, 'stats.duration'],
      [SongSortType.NOTE_COUNT, 'stats.noteCount'],
    ]);

    const sortField = sortFieldMap.get(query.sort ?? SongSortType.RECENT);
    const isDescending = query.order ? query.order === 'desc' : true;

    const pageQuery: PageQueryInput = {
      page: query.page,
      limit: query.limit,
      sort: sortField ?? 'createdAt',
      order: isDescending,
    };

    // Query songs with optional search and category filters
    const result = await this.songService.querySongs(
      pageQuery,
      query.q,
      query.category,
    );

    return {
      content: result.content,
      page: query.page,
      limit: query.limit,
      total: result.total,
      order: isDescending,
    };
  }

  @Get('/featured')
  @ApiOperation({
    summary: 'Get featured songs',
    description: `
      Returns featured songs with specific logic for showcasing popular/recent content.
      This endpoint has very specific business logic and is separate from the general song listing.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Success. Returns featured songs data.',
  })
  public async getFeaturedSongs(): Promise<FeaturedSongsDto> {
    const now = new Date(Date.now());

    const times: Record<(typeof TIMESPANS)[number], number> = {
      hour: new Date(Date.now()).setHours(now.getHours() - 1),
      day: new Date(Date.now()).setDate(now.getDate() - 1),
      week: new Date(Date.now()).setDate(now.getDate() - 7),
      month: new Date(Date.now()).setMonth(now.getMonth() - 1),
      year: new Date(Date.now()).setFullYear(now.getFullYear() - 1),
      all: new Date(0).getTime(),
    };

    const songs: Record<(typeof TIMESPANS)[number], SongWithUser[]> = {
      hour: [],
      day: [],
      week: [],
      month: [],
      year: [],
      all: [],
    };

    for (const [timespan, time] of Object.entries(times)) {
      const songPage = await this.songService.getSongsForTimespan(time);

      // If the length is 0, send an empty array (no songs available in that timespan)
      // If the length is less than the page size, pad it with songs "borrowed"
      // from the nearest timestamp, regardless of view count
      if (
        songPage.length > 0 &&
        songPage.length < BROWSER_SONGS.paddedFeaturedPageSize
      ) {
        const missing = BROWSER_SONGS.paddedFeaturedPageSize - songPage.length;

        const additionalSongs = await this.songService.getSongsBeforeTimespan(
          time,
        );

        songPage.push(...additionalSongs.slice(0, missing));
      }

      songs[timespan as TimespanType] = songPage;
    }

    const featuredSongs = createFeaturedSongsDto();

    featuredSongs.hour = songs.hour.map((song) =>
      songPreviewFromSongDocumentWithUser(song),
    );
    featuredSongs.day = songs.day.map((song) =>
      songPreviewFromSongDocumentWithUser(song),
    );
    featuredSongs.week = songs.week.map((song) =>
      songPreviewFromSongDocumentWithUser(song),
    );
    featuredSongs.month = songs.month.map((song) =>
      songPreviewFromSongDocumentWithUser(song),
    );
    featuredSongs.year = songs.year.map((song) =>
      songPreviewFromSongDocumentWithUser(song),
    );
    featuredSongs.all = songs.all.map((song) =>
      songPreviewFromSongDocumentWithUser(song),
    );

    return featuredSongs;
  }

  @Get('/categories')
  @ApiOperation({
    summary: 'Get available categories with song counts',
    description:
      'Returns a record of available categories and their song counts.',
  })
  @ApiResponse({
    status: 200,
    description: 'Success. Returns category name to count mapping.',
    schema: {
      type: 'object',
      additionalProperties: { type: 'number' },
      example: { pop: 42, rock: 38, electronic: 15 },
    },
  })
  public async getCategories(): Promise<Record<string, number>> {
    return await this.songService.getCategories();
  }

  @Get('/search')
  @ApiOperation({
    summary: 'Search songs by keywords with pagination and sorting',
  })
  public async searchSongs(
    @Query() query: SongSearchQueryDto,
  ): Promise<PageDto<SongPreviewDto>> {
    const { q: searchQ, ...pageQuery } = query;
    const result = await this.songService.querySongs(pageQuery, searchQ ?? '');
    return {
      content: result.content,
      page: result.page,
      limit: result.limit,
      total: result.total,
      order: pageQuery.order ?? true,
    };
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get song info by ID' })
  public async getSong(
    @Param() params: SongIdParamDto,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<SongViewDto> {
    return await this.songService.getSong(params.id, user);
  }

  @Get('/:id/edit')
  @ApiOperation({ summary: 'Get song info for editing by ID' })
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  public async getEditSong(
    @Param() params: SongIdParamDto,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<UploadSongDto> {
    user = validateUser(user);
    return await this.songService.getSongEdit(params.id, user);
  }

  @Patch('/:id/edit')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edit song info by ID' })
  @ApiBody({ description: 'Upload Song' })
  public async patchSong(
    @Param() params: SongIdParamDto,
    @Req() req: RawBodyRequest<Request>,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<UploadSongResponseDto> {
    user = validateUser(user);
    //TODO: Fix this weird type casting and raw body access
    const body = req.body as unknown as UploadSongDto;
    return await this.songService.patchSong(params.id, body, user);
  }

  @Get('/:id/download')
  @ApiOperation({ summary: 'Get song .nbs file' })
  public async getSongFile(
    @Param() params: SongIdParamDto,
    @Query() query: SongFileQueryDto,
    @GetRequestToken() user: UserDocument | null,
    @Res() res: Response,
  ): Promise<void> {
    user = validateUser(user);
    const { src } = query;
    const { id } = params;

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
    @Param() params: SongIdParamDto,
    @GetRequestToken() user: UserDocument | null,
    @Headers() headers: SongOpenHeadersDto,
  ): Promise<string> {
    const { src } = headers;
    const { id } = params;
    if (src != 'downloadButton') {
      throw new UnauthorizedException('Invalid source');
    }

    return await this.songService.getSongDownloadUrl(id, user, 'open', true);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a song' })
  public async deleteSong(
    @Param() params: SongIdParamDto,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<void> {
    user = validateUser(user);
    await this.songService.deleteSong(params.id, user);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Upload Song' })
  @UseInterceptors(FileInterceptor('file', SongController.multerConfig))
  @ApiOperation({
    summary: 'Upload a .nbs file and send the song data, creating a new song',
  })
  public async createSong(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadSongBodyDto,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<UploadSongResponseDto> {
    user = validateUser(user);
    return await this.songService.uploadSong({ body, file, user });
  }
}
