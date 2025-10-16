import type { RawBodyRequest } from '@nestjs/common';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
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

import { UPLOAD_CONSTANTS } from '@nbw/config';
import {
  PageQueryDTO,
  SongPreviewDto,
  SongViewDto,
  UploadSongDto,
  UploadSongResponseDto,
  PageDto,
  SongListQueryDTO,
  SongSortType,
  FeaturedSongsDto,
} from '@nbw/database';
import type { UserDocument } from '@nbw/database';
import { FileService } from '@server/file/file.service';
import { GetRequestToken, validateUser } from '@server/lib/GetRequestUser';

import { SongService } from './song.service';

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
    public readonly songService: SongService,
    public readonly fileService: FileService,
  ) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get songs with filtering and sorting options',
    description: `
      Retrieves songs based on the provided query parameters.
      
      **Query Parameters:**
      - \`q\`: Search string to filter songs by title or description (optional)
      - \`sort\`: Sort songs by criteria (recent, random, play-count, title, duration, note-count)
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
    type: PageDto<SongPreviewDto>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid query parameters.',
  })
  public async getSongList(
    @Query() query: SongListQueryDTO,
  ): Promise<PageDto<SongPreviewDto>> {
    // Handle search query
    if (query.q) {
      const sortFieldMap = new Map([
        [SongSortType.RECENT, 'createdAt'],
        [SongSortType.PLAY_COUNT, 'playCount'],
        [SongSortType.TITLE, 'title'],
        [SongSortType.DURATION, 'duration'],
        [SongSortType.NOTE_COUNT, 'noteCount'],
      ]);

      const sortField = sortFieldMap.get(query.sort) ?? 'createdAt';

      const pageQuery = new PageQueryDTO({
        page: query.page,
        limit: query.limit,
        sort: sortField,
        order: query.order === 'desc' ? false : true,
      });
      const data = await this.songService.searchSongs(pageQuery, query.q);
      return new PageDto<SongPreviewDto>({
        content: data,
        page: query.page,
        limit: query.limit,
        total: data.length,
      });
    }

    // Handle random sort
    if (query.sort === SongSortType.RANDOM) {
      if (query.limit && (query.limit < 1 || query.limit > 10)) {
        throw new BadRequestException(
          'Limit must be between 1 and 10 for random sort',
        );
      }
      const data = await this.songService.getRandomSongs(
        query.limit ?? 1,
        query.category,
      );

      return new PageDto<SongPreviewDto>({
        content: data,
        page: query.page,
        limit: query.limit,
        total: data.length,
      });
    }

    // Handle recent sort
    if (query.sort === SongSortType.RECENT) {
      // If category is provided, use getSongsByCategory (which also sorts by recent)
      if (query.category) {
        const data = await this.songService.getSongsByCategory(
          query.category,
          query.page,
          query.limit,
        );
        return new PageDto<SongPreviewDto>({
          content: data,
          page: query.page,
          limit: query.limit,
          total: data.length,
        });
      }

      const data = await this.songService.getRecentSongs(
        query.page,
        query.limit,
      );
      return new PageDto<SongPreviewDto>({
        content: data,
        page: query.page,
        limit: query.limit,
        total: data.length,
      });
    }

    // Handle category filter
    if (query.category) {
      const data = await this.songService.getSongsByCategory(
        query.category,
        query.page,
        query.limit,
      );
      return new PageDto<SongPreviewDto>({
        content: data,
        page: query.page,
        limit: query.limit,
        total: data.length,
      });
    }

    // Default: get songs with standard pagination
    const sortFieldMap = new Map([
      [SongSortType.PLAY_COUNT, 'playCount'],
      [SongSortType.TITLE, 'title'],
      [SongSortType.DURATION, 'duration'],
      [SongSortType.NOTE_COUNT, 'noteCount'],
    ]);

    const sortField = sortFieldMap.get(query.sort) ?? 'createdAt';

    const pageQuery = new PageQueryDTO({
      page: query.page,
      limit: query.limit,
      sort: sortField,
      order: query.order === 'desc' ? false : true,
    });
    const data = await this.songService.getSongByPage(pageQuery);
    return new PageDto<SongPreviewDto>({
      content: data,
      page: query.page,
      limit: query.limit,
      total: data.length,
    });
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
    type: FeaturedSongsDto,
  })
  public async getFeaturedSongs(): Promise<FeaturedSongsDto> {
    return await this.songService.getFeaturedSongs();
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
    @Query() query: PageQueryDTO,
    @Query('q') q: string,
  ): Promise<PageDto<SongPreviewDto>> {
    const data = await this.songService.searchSongs(query, q ?? '');
    return new PageDto<SongPreviewDto>({
      content: data,
      page: query.page,
      limit: query.limit,
      total: data.length,
    });
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
  @ApiBody({ description: 'Upload Song', type: UploadSongResponseDto })
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
  @ApiBody({ description: 'Upload Song', type: UploadSongResponseDto })
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
