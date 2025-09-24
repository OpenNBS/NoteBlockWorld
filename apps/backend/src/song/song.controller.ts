import { UPLOAD_CONSTANTS } from '@nbw/config';
import { PageDto, UserDocument ,  PageQueryDTO,  SongPreviewDto,  SongViewDto,  UploadSongDto,  UploadSongResponseDto, FeaturedSongsDto,} from '@nbw/database';
import type { RawBodyRequest } from '@nestjs/common';
import {  BadRequestException,  Body,  Controller,  Delete,  Get,  Headers,  HttpStatus,  Param,  Patch,  Post,  Query,  Req,  Res,  UnauthorizedException,  UploadedFile,  UseGuards,  UseInterceptors,} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {  ApiBearerAuth,  ApiBody,  ApiConsumes,  ApiOperation,  ApiParam,  ApiQuery,  ApiResponse,  ApiTags,} from '@nestjs/swagger';
import type { Response } from 'express';

import { FileService } from '@server/file/file.service';
import { GetRequestToken, validateUser } from '@server/lib/GetRequestUser';

import { SongService } from './song.service';

@Controller('song')
@ApiTags('song')
export class SongController {
  static multerConfig: MulterOptions = {
    limits    : { fileSize: UPLOAD_CONSTANTS.file.maxSize },
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(nbs)$/))
        return cb(new Error('Only .nbs files are allowed!'), false);
      cb(null, true);
    },
  };

  constructor(  public readonly songService: SongService,  public readonly fileService: FileService, ) {}

  @Get('/')
  @ApiOperation({
    summary    : 'Get songs with various filtering and browsing options',
    description: `
      Retrieves songs based on the provided query parameters. Supports multiple modes:
      
      **Default mode** (no 'q' parameter): Returns paginated songs with sorting/filtering
      
      **Special query modes** (using 'q' parameter):
      - \`featured\`: Get recent popular songs with pagination
      - \`recent\`: Get recently uploaded songs with pagination  
      - \`categories\`: 
        - Without 'id': Returns a record of available categories and their song counts
        - With 'id': Returns songs from the specified category with pagination
      - \`random\`: Returns random songs (requires 'count' parameter, 1-10 songs, optionally filtered by 'category')
      
      **Query Parameters:**
      - Standard pagination/sorting via PageQueryDTO (page, limit, sort, order, timespan)
      - \`q\`: Special query mode ('featured', 'recent', 'categories', 'random')
      - \`id\`: Category ID (used with q=categories to get songs from specific category)
      - \`count\`: Number of random songs to return (1-10, used with q=random)
      - \`category\`: Category filter for random songs (used with q=random)
      
      **Return Types:**
      - SongPreviewDto[]: Array of song previews (most cases)
      - Record<string, number>: Category name to count mapping (when q=categories without id)
    `,
  })
  @ApiQuery({  name: 'q',  required: false,  enum: ['featured', 'recent', 'categories', 'random'],  description: 'Special query mode. If not provided, returns standard paginated song list.',  example: 'recent',})
  @ApiParam({  name: 'id',  required: false,  type: 'string',  description: 'Category ID. Only used when q=categories to get songs from a specific category.',  example: 'pop',})
  @ApiQuery({  name: 'count',  required: false,  type: 'string',  description: 'Number of random songs to return (1-10). Only used when q=random.',  example: '5',})
  @ApiQuery({  name: 'category',  required: false,  type: 'string',  description: 'Category filter for random songs. Only used when q=random.',  example: 'electronic',})
  @ApiResponse({
    status     : 200,
    description: 'Success. Returns either an array of song previews or category counts.',
    schema     : {
      oneOf: [
        {
          type       : 'array',
          items      : { $ref: '#/components/schemas/SongPreviewDto' },
          description: 'Array of song previews (default behavior and most query modes)',
        },
        {
          type                : 'object',
          additionalProperties: { type: 'number' },
          description         : 'Category name to song count mapping (only when q=categories without id)',
          example             : { pop: 42, rock: 38, electronic: 15 },
        },
      ],
    },
  })
  @ApiResponse({
    status     : 400,
    description: 'Bad Request. Invalid query parameters (e.g., invalid count for random query).',
  })
  public async getSongList(
    @Query() query: PageQueryDTO,
    @Query('q') q?: 'featured' | 'recent' | 'categories' | 'random',
    @Param('id') id?: string,
    @Query('category') category?: string,
  ): Promise<PageDto<SongPreviewDto> | Record<string, number> | FeaturedSongsDto> {
    if (q) {
      switch (q) {
        case 'featured':
          return await this.songService.getFeaturedSongs();
        case 'recent':
          return new PageDto<SongPreviewDto>({
            content: await this.songService.getRecentSongs(     query.page,     query.limit, ),
            page   : query.page,
            limit  : query.limit,
            total  : 0,
          });
        case 'categories':
          if (id) {
            return new PageDto<SongPreviewDto>({
              content: await this.songService.getSongsByCategory(
                category,
                query.page,
                query.limit,
              ),
              page : query.page,
              limit: query.limit,
              total: 0,
            });
          }
          return await this.songService.getCategories();
        case 'random': {
          if (query.limit && (query.limit < 1 || query.limit > 10)) {
            throw new BadRequestException('Invalid query parameters');
          }
          const data = await this.songService.getRandomSongs(
            query.limit ?? 1,
            category,
          );
          return new PageDto<SongPreviewDto>({
            content: data,
            page   : query.page,
            limit  : query.limit,
            total  : data.length,
          });
        }
        default:
          throw new BadRequestException('Invalid query parameters');
      }
    }

    const data = await this.songService.getSongByPage(query);
    return new PageDto<SongPreviewDto>({
      content: data,
      page   : query.page,
      limit  : query.limit,
      total  : data.length,
    });
  }

  @Get('/search')
  @ApiOperation({ summary: 'Search songs by keywords with pagination and sorting',  })
  public async searchSongs(  @Query() query: PageQueryDTO,  @Query('q') q: string,): Promise<PageDto<SongPreviewDto>> {
    const data = await this.songService.searchSongs(query, q ?? '');
    return new PageDto<SongPreviewDto>({
      content: data,
      page   : query.page,
      limit  : query.limit,
      total  : data.length,
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get song info by ID' })
  public async getSong(  @Param('id') id: string,  @GetRequestToken() user: UserDocument | null,): Promise<SongViewDto> {
    return await this.songService.getSong(id, user);
  }

  @Get('/:id/edit')
  @ApiOperation({ summary: 'Get song info for editing by ID' })
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  public async getEditSong(  @Param('id') id: string,  @GetRequestToken() user: UserDocument | null,): Promise<UploadSongDto> {
    user = validateUser(user);
    return await this.songService.getSongEdit(id, user);
  }

  @Patch('/:id/edit')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edit song info by ID' })
  @ApiBody({   description: 'Upload Song',   type: UploadSongResponseDto, })
  public async patchSong(  @Param('id') id: string,  @Req() req: RawBodyRequest<Request>,  @GetRequestToken() user: UserDocument | null,): Promise<UploadSongResponseDto> {
    user = validateUser(user);
    //TODO: Fix this weird type casting and raw body access
    const body = req.body as unknown as UploadSongDto;
    return await this.songService.patchSong(id, body, user);
  }

  @Get('/:id/download')
  @ApiOperation({ summary: 'Get song .nbs file' })
  public async getSongFile(  @Param('id') id: string,  @Query('src') src: string,  @GetRequestToken() user: UserDocument | null,  @Res() res: Response,): Promise<void> {
    user = validateUser(user);

    // TODO: no longer used
    res.set({
      'Content-Disposition'          : 'attachment; filename="song.nbs"',
      // Expose the Content-Disposition header to the client
      'Access-Control-Expose-Headers': 'Content-Disposition',
    });

    const url = await this.songService.getSongDownloadUrl(id, user, src, false);
    res.redirect(HttpStatus.FOUND, url);
  }

  @Get('/:id/open')
  @ApiOperation({ summary: 'Get song .nbs file' })
  public async getSongOpenUrl(  @Param('id') id: string,  @GetRequestToken() user: UserDocument | null,  @Headers('src') src: string,): Promise<string> {
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
  public async deleteSong(  @Param('id') id: string,  @GetRequestToken() user: UserDocument | null,): Promise<void> {
    user = validateUser(user);
    await this.songService.deleteSong(id, user);
  }

  @Post('/')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({  description: 'Upload Song',  type: UploadSongResponseDto,})
  @UseInterceptors(FileInterceptor('file', SongController.multerConfig))
  @ApiOperation({    summary: 'Upload a .nbs file and send the song data, creating a new song',})
  public async createSong(  @UploadedFile() file: Express.Multer.File,  @Body() body: UploadSongDto,  @GetRequestToken() user: UserDocument | null,): Promise<UploadSongResponseDto> {
    user = validateUser(user);
    return await this.songService.uploadSong({ body, file, user });
  }
}
