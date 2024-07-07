import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';
import { BROWSER_SONGS } from '@shared/validation/song/constants';
import { SongPageDto } from '@shared/validation/song/dto/SongPageDto';
import { SongPreviewDto } from '@shared/validation/song/dto/SongPreview.dto';
import { SongViewDto } from '@shared/validation/song/dto/SongView.dto';
import { UploadSongDto } from '@shared/validation/song/dto/UploadSongDto.dto';
import { UploadSongResponseDto } from '@shared/validation/song/dto/UploadSongResponseDto.dto';
import { Model } from 'mongoose';

import { FileService } from '@server/file/file.service';
import { UserDocument } from '@server/user/entity/user.entity';

import {
  SongDocument,
  Song as SongEntity,
  SongWithUser,
} from './entity/song.entity';
import { SongUploadService } from './song-upload/song-upload.service';
import { removeExtraSpaces } from './song.util';

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
  ) {}

  private isUserValid(user: UserDocument | null) {
    if (!user) {
      throw new HttpException(
        {
          error: {
            user: 'User not found',
          },
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  public async uploadSong({
    file,
    user,
    body,
  }: {
    body: UploadSongDto;
    file: Express.Multer.File;
    user: UserDocument | null;
  }): Promise<UploadSongResponseDto> {
    // Is user valid?
    this.isUserValid(user);
    user = user as UserDocument;

    const song = await this.songUploadService.processUploadedSong({
      file,
      user,
      body,
    });

    // Save song document
    const songDocument = await this.songModel.create(song);
    const createdSong = await songDocument.save();

    const populatedSong = (await createdSong.populate(
      'uploader',
      'username profileImage -_id',
    )) as unknown as SongWithUser;

    return UploadSongResponseDto.fromSongWithUserDocument(populatedSong);
  }

  public async deleteSong(
    publicId: string,
    user: UserDocument | null,
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

    await this.songModel
      .deleteOne({ publicId: publicId })
      .populate('uploader')
      .exec();

    await this.fileService.deleteSong(foundSong.nbsFileUrl);

    return UploadSongResponseDto.fromSongWithUserDocument(
      (await foundSong.populate('uploader')) as unknown as SongWithUser,
    );
  }

  public async patchSong(
    publicId: string,
    body: UploadSongDto,
    user: UserDocument | null,
  ): Promise<UploadSongResponseDto> {
    const foundSong = (await this.songModel
      .findOne({
        publicId: publicId,
      })
      .exec()) as unknown as SongDocument;

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

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

    // Save song document
    const updatedSong = await foundSong.save();

    const populatedSong = (await updatedSong.populate(
      'uploader',
      'username profileImage -_id',
    )) as unknown as SongWithUser;

    return UploadSongResponseDto.fromSongWithUserDocument(populatedSong);
  }

  public async getSongByPage(query: PageQueryDTO): Promise<SongPreviewDto[]> {
    const { page, limit, sort, order } = query;

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
        [sort]: order ? 1 : -1,
      })
      .skip(page * limit - limit)
      .limit(limit)
      .populate('uploader', 'username profileImage -_id')
      .exec()) as unknown as SongWithUser[];

    return songs.map((song) => SongPreviewDto.fromSongDocumentWithUser(song));
  }

  public async getRecentSongs(
    page: number,
    limit: number,
  ): Promise<SongPreviewDto[]> {
    const queryObject: any = {
      visibility: 'public',
    };

    const data = (await this.songModel
      .find(queryObject)
      .sort({
        createdAt: -1,
      })
      .skip(page * limit - limit)
      .limit(limit)
      .populate('uploader', 'username profileImage -_id')
      .exec()) as unknown as SongWithUser[];

    return data.map((song) => SongPreviewDto.fromSongDocumentWithUser(song));
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
    const foundSong = await this.songModel
      .findOne({ publicId: publicId })
      .populate('uploader', 'username profileImage -_id')
      .exec();

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

    return SongViewDto.fromSongDocument(foundSong);
  }

  // TODO: service should not handle HTTP -> https://www.reddit.com/r/node/comments/uoicw1/should_i_return_status_code_from_service_layer/
  public async getSongDownloadUrl(
    publicId: string,
    user: UserDocument | null,
    src?: string,
    packed: boolean = false,
  ): Promise<string> {
    const foundSong = await this.songModel
      .findOne({ publicId: publicId })
      .exec();

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

  public async getMySongsPage(arg0: {
    query: PageQueryDTO;
    user: UserDocument | null;
  }): Promise<SongPageDto> {
    const { query, user } = arg0;

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const page = parseInt(query.page?.toString() ?? '1');
    const limit = parseInt(query.limit?.toString() ?? '10');
    const order = query.order ? query.order : false;
    const sort = query.sort ? query.sort : 'recent';

    const songData = (await this.songModel
      .find({
        uploader: user._id,
      })
      .sort({
        [sort]: order ? 1 : -1,
      })
      .skip(limit * (page - 1))
      .limit(limit)
      .exec()) as unknown as SongWithUser[];

    const total = await this.songModel
      .countDocuments({
        uploader: user._id,
      })
      .exec();

    return {
      content: songData.map((song) =>
        SongPreviewDto.fromSongDocumentWithUser(song),
      ),
      page: page,
      limit: limit,
      total: total,
    };
  }

  public async getSongEdit(
    publicId: string,
    user: UserDocument | null,
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

    return UploadSongDto.fromSongDocument(foundSong);
  }
}
