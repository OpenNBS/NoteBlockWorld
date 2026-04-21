import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BROWSER_SONGS } from '@nbw/config';
import {
  Song as SongEntity,
  type SongWithUser,
  UserDocument,
} from '@nbw/database';
import {
  pageQueryDTOSchema,
  type PageQueryInput,
  type SongPageDto,
  type SongPreviewDto,
  type SongViewDto,
  type UploadSongDto,
  type UploadSongResponseDto,
} from '@nbw/validation';
import { FileService } from '@server/file/file.service';
import { UserService } from '@server/user/user.service';

import { SongUploadService } from './song-upload/song-upload.service';
import { SongWebhookService } from './song-webhook/song-webhook.service';
import {
  removeExtraSpaces,
  songPreviewFromSongDocumentWithUser,
  songViewDtoFromSongDocument,
  uploadSongDtoFromSongDocument,
  uploadSongResponseDtoFromSongWithUser,
} from './song.util';

@Injectable()
export class SongService {
  private logger = new Logger(SongService.name);
  constructor(
    @InjectModel(SongEntity.name)
    private songModel: Model<SongEntity>,

    @Inject(FileService)
    private fileService: FileService,

    @Inject(SongUploadService)
    private songUploadService: SongUploadService,

    @Inject(SongWebhookService)
    private songWebhookService: SongWebhookService,

    @Inject(UserService)
    private userService: UserService,
  ) {}

  public async getSongById(publicId: string) {
    return this.songModel.findOne({
      publicId,
    });
  }

  public async uploadSong({
    file,
    user,
    body,
  }: {
    body: UploadSongDto;
    file: Express.Multer.File;
    user: UserDocument;
  }): Promise<UploadSongResponseDto> {
    const song = await this.songUploadService.processUploadedSong({
      file,
      user,
      body,
    });

    // Create song document
    const songDocument = await this.songModel.create(song);

    // Post Discord webhook
    const populatedSong = (await songDocument.populate(
      'uploader',
      'username profileImage -_id',
    )) as unknown as SongWithUser;

    const webhookMessageId = await this.songWebhookService.syncSongWebhook(
      populatedSong,
    );

    songDocument.webhookMessageId = webhookMessageId;

    // Save song document
    await songDocument.save();

    return uploadSongResponseDtoFromSongWithUser(populatedSong);
  }

  public async deleteSong(
    publicId: string,
    user: UserDocument,
  ): Promise<UploadSongResponseDto> {
    const foundSong = await this.songModel
      .findOne({ publicId: publicId })
      .exec();

    if (!foundSong) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }

    if (foundSong.uploader.toString() !== user?._id.toString()) {
      throw new HttpException('Song not found', HttpStatus.UNAUTHORIZED);
    }

    await this.songModel.deleteOne({ publicId: publicId }).exec();

    await this.fileService.deleteSong(foundSong.nbsFileUrl);

    const populatedSong = (await foundSong.populate(
      'uploader',
      'username profileImage -_id',
    )) as unknown as SongWithUser;

    await this.songWebhookService.deleteSongWebhook(populatedSong);

    return uploadSongResponseDtoFromSongWithUser(populatedSong);
  }

  public async patchSong(
    publicId: string,
    body: UploadSongDto,
    user: UserDocument,
  ): Promise<UploadSongResponseDto> {
    const foundSong = await this.songModel.findOne({
      publicId: publicId,
    });

    if (!foundSong) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }

    if (foundSong.uploader.toString() !== user?._id.toString()) {
      throw new HttpException('Song not found', HttpStatus.UNAUTHORIZED);
    }

    if (
      foundSong.title === body.title &&
      foundSong.originalAuthor === body.originalAuthor &&
      foundSong.description === body.description &&
      foundSong.category === body.category &&
      foundSong.allowDownload === body.allowDownload &&
      foundSong.visibility === body.visibility &&
      foundSong.license === body.license &&
      JSON.stringify(foundSong.thumbnailData) ===
        JSON.stringify(body.thumbnailData) &&
      JSON.stringify(foundSong.customInstruments) ===
        JSON.stringify(body.customInstruments)
    ) {
      throw new HttpException('No changes detected', HttpStatus.BAD_REQUEST);
    }

    // Check if updates to the song files and/or thumbnail are necessary;
    // if so, update and reupload them
    await this.songUploadService.processSongPatch(foundSong, body, user);

    // Update song document
    foundSong.title = removeExtraSpaces(body.title);
    foundSong.originalAuthor = removeExtraSpaces(body.originalAuthor);
    foundSong.description = removeExtraSpaces(body.description);
    foundSong.category = body.category;
    foundSong.allowDownload = body.allowDownload;
    foundSong.visibility = body.visibility;
    foundSong.license = body.license;
    foundSong.thumbnailData = body.thumbnailData;
    foundSong.customInstruments = body.customInstruments;

    // Update document's last update time
    foundSong.updatedAt = new Date();

    const populatedSong = (await foundSong.populate(
      'uploader',
      'username profileImage -_id',
    )) as unknown as SongWithUser;

    foundSong.webhookMessageId = await this.songWebhookService.syncSongWebhook(
      populatedSong,
    );

    // Save song document
    await foundSong.save();

    return uploadSongResponseDtoFromSongWithUser(populatedSong);
  }

  public async getSongByPage(query: PageQueryInput): Promise<SongPreviewDto[]> {
    const q = pageQueryDTOSchema.parse(query);
    const { page, limit, sort } = q;
    const ascendingOrder = q.order === 'asc';

    if (!page || !limit || !sort) {
      throw new HttpException(
        'Invalid query parameters',
        HttpStatus.BAD_REQUEST,
      );
    }

    const songs = (await this.songModel
      .find({
        visibility: 'public',
      })
      .sort({
        [sort]: ascendingOrder ? 1 : -1,
      })
      .skip(page * limit - limit)
      .limit(limit)
      .populate('uploader', 'username publicName profileImage -_id')
      .exec()) as unknown as SongWithUser[];

    return songs.map((song) => songPreviewFromSongDocumentWithUser(song));
  }

  public async querySongs(
    query: PageQueryInput,
    q?: string,
    category?: string,
    uploaderUsername?: string,
  ): Promise<SongPageDto> {
    const parsed = pageQueryDTOSchema.parse(query);
    const page = parsed.page;
    const limit = parsed.limit ?? 10;
    const ascendingOrder = parsed.order === 'asc';

    const allowedSorts = new Set([
      'createdAt',
      'playCount',
      'title',
      'stats.duration',
      'stats.noteCount',
    ]);
    const sortField = allowedSorts.has(parsed.sort ?? '')
      ? (parsed.sort as string)
      : 'createdAt';

    const mongoQuery: any = {
      visibility: 'public',
    };

    if (uploaderUsername) {
      const uploader = await this.userService.findByUsername(uploaderUsername);
      if (!uploader) {
        return {
          content: [],
          page,
          limit,
          total: 0,
        };
      }
      mongoQuery.uploader = uploader._id;
    }

    // Add category filter if provided
    if (category) {
      mongoQuery.category = category;
    }

    // Add search filter if search query is provided
    if (q) {
      const terms = q
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      // Build Google-like search: all words must appear across any of the fields
      if (terms.length > 0) {
        mongoQuery.$and = terms.map((word) => ({
          $or: [
            { title: { $regex: word, $options: 'i' } },
            { originalAuthor: { $regex: word, $options: 'i' } },
            { description: { $regex: word, $options: 'i' } },
          ],
        }));
      }
    }

    const sortOrder = ascendingOrder ? 1 : -1;

    const [songs, total] = await Promise.all([
      this.songModel
        .find(mongoQuery)
        .sort({ [sortField]: sortOrder })
        .skip(limit * (page - 1))
        .limit(limit)
        .populate('uploader', 'username profileImage -_id')
        .exec() as unknown as Promise<SongWithUser[]>,
      this.songModel.countDocuments(mongoQuery),
    ]);

    return {
      content: songs.map((song) => songPreviewFromSongDocumentWithUser(song)),
      page,
      limit,
      total,
    };
  }

  public async getSongsForTimespan(timespan: number): Promise<SongWithUser[]> {
    return this.songModel
      .find<SongWithUser>({
        visibility: 'public',
        createdAt: {
          $gte: timespan,
        },
      })
      .sort({ playCount: -1 })
      .limit(BROWSER_SONGS.featuredPageSize)
      .populate('uploader', 'username profileImage -_id')
      .exec();
  }

  public async getSongsBeforeTimespan(
    timespan: number,
  ): Promise<SongWithUser[]> {
    return this.songModel
      .find<SongWithUser>({
        visibility: 'public',
        createdAt: {
          $lt: timespan,
        },
      })
      .sort({ createdAt: -1 })
      .limit(BROWSER_SONGS.featuredPageSize)
      .populate('uploader', 'username profileImage -_id')
      .exec();
  }

  public async getSong(
    publicId: string,
    user: UserDocument | null,
  ): Promise<SongViewDto> {
    const foundSong = await this.songModel.findOne({ publicId: publicId });

    if (!foundSong) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }

    if (foundSong.visibility === 'private') {
      if (!user) {
        throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
      }

      if (foundSong.uploader.toString() !== user._id.toString()) {
        throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
      }
    }

    // increment view count
    foundSong.playCount++;
    await foundSong.save();

    const populatedSong = await foundSong.populate(
      'uploader',
      'username profileImage',
    );

    return songViewDtoFromSongDocument(
      populatedSong as unknown as SongWithUser,
    );
  }

  // TODO: service should not handle HTTP -> https://www.reddit.com/r/node/comments/uoicw1/should_i_return_status_code_from_service_layer/
  public async getSongDownloadUrl(
    publicId: string,
    user: UserDocument | null,
    src?: string,
    packed: boolean = false,
  ): Promise<string> {
    const foundSong = await this.songModel.findOne({ publicId: publicId });

    if (!foundSong) {
      throw new HttpException('Song not found with ID', HttpStatus.NOT_FOUND);
    }

    if (foundSong.visibility !== 'public') {
      if (!user || foundSong.uploader.toString() !== user._id.toString()) {
        throw new HttpException(
          'This song is private',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }

    if (!packed && !foundSong.allowDownload) {
      throw new HttpException(
        'The uploader has disabled downloads of this song',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const fileKey = packed ? foundSong.packedSongUrl : foundSong.nbsFileUrl;
    const fileExt = packed ? '.zip' : '.nbs';

    const fileName = `${foundSong.title}${fileExt}`;

    try {
      const url = await this.fileService.getSongDownloadUrl(fileKey, fileName);

      // increment download count
      if (!packed && src === 'downloadButton') foundSong.downloadCount++;
      await foundSong.save();

      return url;
    } catch (e) {
      this.logger.error('Error getting song file', e);
      throw new HttpException(
        'An error occurred while retrieving the song file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getMySongsPage({
    query,
    user,
  }: {
    query: PageQueryInput;
    user: UserDocument;
  }): Promise<SongPageDto> {
    const q = pageQueryDTOSchema.parse(query);
    const page = q.page;
    const limit = q.limit ?? 10;
    const ascendingOrder = q.order === 'asc';
    const sort = q.sort ?? 'recent';

    const songData = (await this.songModel
      .find({
        uploader: user._id,
      })
      .sort({
        [sort]: ascendingOrder ? 1 : -1,
      })
      .skip(limit * (page - 1))
      .limit(limit)) as unknown as SongWithUser[];

    const total = await this.songModel.countDocuments({
      uploader: user._id,
    });

    return {
      content: songData.map((song) =>
        songPreviewFromSongDocumentWithUser(song),
      ),
      page: page,
      limit: limit,
      total: total,
    };
  }

  public async getSongEdit(
    publicId: string,
    user: UserDocument,
  ): Promise<UploadSongDto> {
    const foundSong = await this.songModel
      .findOne({ publicId: publicId })
      .exec();

    if (!foundSong) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }

    if (foundSong.uploader.toString() !== user?._id.toString()) {
      throw new HttpException('Song not found', HttpStatus.UNAUTHORIZED);
    }

    return uploadSongDtoFromSongDocument(foundSong);
  }

  public async getCategories(): Promise<Record<string, number>> {
    // Return an object with categories and their counts, minus empty categories, minus private songs, and sort by count

    const categories = (await this.songModel.aggregate([
      {
        $match: {
          visibility: 'public',
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ])) as unknown as { _id: string; count: number }[];

    // Return object with category names as keys and counts as values
    return categories.reduce((acc, category) => {
      if (category._id) {
        acc[category._id] = category.count;
      }

      return acc;
    }, {} as Record<string, number>);
  }

  public async getRandomSongs(
    count: number,
    category?: string,
  ): Promise<SongPreviewDto[]> {
    const matchStage: Record<string, string> = {
      visibility: 'public',
    };

    // Only add category filter if category is provided and not empty
    if (category && category.trim() !== '') {
      matchStage.category = category;
    }

    const songs = (await this.songModel
      .aggregate([
        {
          $match: matchStage,
        },
        {
          $sample: {
            size: count,
          },
        },
      ])
      .exec()) as unknown as SongWithUser[];

    await this.songModel.populate(songs, {
      path: 'uploader',
      select: 'username profileImage -_id',
    });

    return songs.map((song) => songPreviewFromSongDocumentWithUser(song));
  }
}
