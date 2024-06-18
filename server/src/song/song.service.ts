import { fromArrayBuffer } from '@encode42/nbs.js';
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
import { TimespanType } from '@shared/validation/song/dto/types';
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
      foundSong.customInstruments === body.customInstruments &&
      foundSong.thumbnailData === body.thumbnailData &&
      foundSong._sounds === body.customInstruments
    ) {
      throw new HttpException('No changes detected', HttpStatus.BAD_REQUEST);
    }

    // Update song document
    foundSong.title = body.title;
    foundSong.originalAuthor = body.originalAuthor;
    foundSong.description = body.description;
    foundSong.category = body.category;
    foundSong.allowDownload = body.allowDownload;
    foundSong.visibility = body.visibility;
    foundSong.license = body.license;
    foundSong.customInstruments = body.customInstruments;
    foundSong._sounds = body.customInstruments;
    // Update NBS file with form values
    //TODO: Update song metadata
    const songFile = await this.fileService.getSongFile(foundSong.nbsFileUrl);
    const nbsSong = fromArrayBuffer(songFile);
    this.songUploadService.updateSongFileMetadata(nbsSong, body, user);

    // if new thumbnail data the same as existing one?
    if (
      !(
        body.thumbnailData.backgroundColor ===
          foundSong.thumbnailData.backgroundColor &&
        body.thumbnailData.startLayer === foundSong.thumbnailData.startLayer &&
        body.thumbnailData.startTick === foundSong.thumbnailData.startTick &&
        body.thumbnailData.zoomLevel === foundSong.thumbnailData.zoomLevel
      )
    ) {
      foundSong.thumbnailUrl = await this.songUploadService.generateThumbnail(
        body.thumbnailData,
        nbsSong,
        foundSong.publicId,
        foundSong.nbsFileUrl,
      );

      foundSong.thumbnailData = body.thumbnailData;
    }

    //TODO: update song document

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

        return this.getFeaturedSongs(timespan as TimespanType);
      case 'recent':
        if (!page || !limit) {
          throw new HttpException(
            'Invalid query parameters',
            HttpStatus.BAD_REQUEST,
          );
        }

        return this.getRecentSongs(page, limit);
    }
  }

  private async getRecentSongs(
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

  private async getFeaturedSongs(
    timespan: TimespanType,
  ): Promise<SongPreviewDto[]> {
    let laterThan = new Date(Date.now());

    switch (timespan) {
      case 'hour':
        laterThan.setHours(laterThan.getHours() - 1);
        break;
      case 'day':
        laterThan.setDate(laterThan.getDate() - 1);
        break;
      case 'week':
        laterThan.setDate(laterThan.getDate() - 7);
        break;
      case 'month':
        laterThan.setMonth(laterThan.getMonth() - 1);
        break;
      case 'year':
        laterThan.setFullYear(laterThan.getFullYear() - 1);
        break;
      default:
        laterThan = new Date(0);
    }

    const data = (await this.songModel
      .find({
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

    if (!foundSong.allowDownload) {
      throw new HttpException(
        'The uploader has disabled downloads of this song',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const url = await this.fileService.getSongDownloadUrl(
        foundSong.nbsFileUrl,
        'song.nbs', // TODO: foundSong.filename
      );

      // increment download count
      if (src !== 'edit') foundSong.downloadCount++;
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
