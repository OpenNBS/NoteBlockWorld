import { Song, fromArrayBuffer } from '@encode42/nbs.js';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { drawToImage, getThumbnailNotes } from '@shared/features/thumbnail';
import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';
import { SongPageDto } from '@shared/validation/song/dto/SongPageDto';
import { SongPreviewDto } from '@shared/validation/song/dto/SongPreview.dto';
import { SongViewDto } from '@shared/validation/song/dto/SongView.dto';
import { ThumbnailData } from '@shared/validation/song/dto/ThumbnailData.dto';
import { TimespanType } from '@shared/validation/song/dto/types';
import { UploadSongDto } from '@shared/validation/song/dto/UploadSongDto.dto';
import { UploadSongResponseDto } from '@shared/validation/song/dto/UploadSongResponseDto.dto';
import { Model, Types } from 'mongoose';

import { FileService } from '@server/file/file.service';
import { UserDocument } from '@server/user/entity/user.entity';
import { UserService } from '@server/user/user.service';

import {
  SongDocument,
  Song as SongEntity,
  SongWithUser,
} from './entity/song.entity';
import { generateSongId, removeNonAscii } from './song.util';

@Injectable()
export class SongService {
  private logger = new Logger(SongService.name);
  constructor(
    @InjectModel(SongEntity.name)
    private songModel: Model<SongEntity>,
    @Inject(UserService)
    private userService: UserService,
    @Inject(FileService)
    private fileService: FileService,
  ) {}

  private async validateUploader(user: UserDocument): Promise<Types.ObjectId> {
    const uploader = await this.userService.findByID(user._id.toString());
    if (!uploader) {
      throw new HttpException(
        'user not found, contact an administrator',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return uploader._id;
  }

  public async processUploadedSong({
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

    // Is file valid?
    this.checkIsFileValid(file);

    // Load file into memory
    const loadedArrayBuffer = new ArrayBuffer(file.buffer.byteLength);
    const view = new Uint8Array(loadedArrayBuffer);
    for (let i = 0; i < file.buffer.byteLength; ++i) {
      view[i] = file.buffer[i];
    }

    // Is the uploaded file a valid .nbs file?
    const nbsSong = this.getSongObject(loadedArrayBuffer);

    // Upload file
    const fileKey: string = await this.uploadSongFile(file);

    // PROCESS UPLOADED SONG
    // TODO: delete file from S3 if remainder of upload method fails

    // const category = body.category;

    // Generate song public ID
    const publicId = generateSongId();

    // Calculate song document's data from NBS file
    const songStats = this.getSongStats(file, nbsSong);

    // Update NBS file with form values
    this.updateSongFileMetadata(nbsSong, body, user);

    // Generate thumbnail
    const thumbUrl: string = await this.generateThumbnail(
      body.thumbnailData,
      nbsSong,
      publicId,
      fileKey,
    );

    // create song document

    const song = await this.generateSongDocument(
      user,
      publicId,
      body,
      thumbUrl,
      fileKey,
      songStats,
    );

    // Save song document
    const songDocument = await this.songModel.create(song);
    const createdSong = await songDocument.save();
    const populatedSong = (await createdSong.populate(
      'uploader',
      'username profileImage -_id',
    )) as unknown as SongWithUser;
    return UploadSongResponseDto.fromSongWithUserDocument(populatedSong);
  }

  private async generateSongDocument(
    user: UserDocument,
    publicId: string,
    body: UploadSongDto,
    thumbUrl: string,
    fileKey: string,
    songStats: {
      fileSize: number;
      midiFileName: string;
      noteCount: number;
      tickCount: number;
      layerCount: number;
      tempo: number;
      timeSignature: number;
      duration: number;
      loop: boolean;
      loopStartTick: number;
      minutesSpent: number;
      usesCustomInstruments: boolean;
      isInOctaveRange: boolean;
      compatible: boolean;
    },
  ) {
    const song = new SongEntity();
    song.uploader = await this.validateUploader(user);
    song.publicId = publicId;
    song.title = body.title;
    song.originalAuthor = body.originalAuthor;
    song.description = body.description;
    song.category = body.category;
    song.allowDownload = true || body.allowDownload; //TODO: implement allowDownload;
    song.visibility = body.visibility;
    song.license = body.license;
    song.customInstruments = body.customInstruments;

    song.thumbnailData = body.thumbnailData;
    song._sounds = body.customInstruments; // TODO: validate custom instruments
    song.thumbnailUrl = thumbUrl;
    song.nbsFileUrl = fileKey; // s3File.Location;

    // Song stats
    song.fileSize = songStats.fileSize;
    song.compatible = songStats.compatible;
    song.midiFileName = songStats.midiFileName;
    song.noteCount = songStats.noteCount;
    song.tickCount = songStats.tickCount;
    song.layerCount = songStats.layerCount;
    song.tempo = songStats.tempo;
    song.timeSignature = songStats.timeSignature;
    song.duration = songStats.duration;
    song.loop = songStats.loop;
    song.loopStartTick = songStats.loopStartTick;
    song.minutesSpent = songStats.minutesSpent;

    return song;
  }

  // TODO: move all upload auxiliary methods to new UploadSongService

  private getSongStats(file: Express.Multer.File, nbsSong: Song) {
    return {
      fileSize: file.size,
      midiFileName: nbsSong.meta.importName || '',
      noteCount: 0, // TODO(Bentroen): calculate,
      tickCount: nbsSong.length,
      layerCount: nbsSong.layers.length,
      tempo: nbsSong.tempo,
      timeSignature: nbsSong.timeSignature,
      duration: nbsSong.length / nbsSong.tempo, // TODO(Bentroen): take tempo changers into account
      loop: nbsSong.loop.enabled,
      loopStartTick: nbsSong.loop.startTick,
      minutesSpent: nbsSong.stats.minutesSpent,
      usesCustomInstruments: false, // TODO(Bentroen): check if song.instruments.length > firstCustomIndex
      isInOctaveRange: false, // TODO(Bentroen): check if any(note => note.pitch < 33 || note.pitch > 57)
      compatible: false, //TODO(Bentroen): usesCustomInstruments && isInOctaveRange,
    };
  }

  private updateSongFileMetadata(
    nbsSong: Song,
    body: UploadSongDto,
    user: UserDocument,
  ) {
    nbsSong.meta.name = removeNonAscii(body.title);
    nbsSong.meta.author = removeNonAscii(user.username);
    nbsSong.meta.originalAuthor = removeNonAscii(body.originalAuthor);
    nbsSong.meta.description = removeNonAscii(body.description);
  }

  private async generateThumbnail(
    thumbnailData: ThumbnailData,
    nbsSong: Song,
    publicId: string,
    fileKey: string,
  ) {
    const { startTick, startLayer, zoomLevel, backgroundColor } = thumbnailData;

    const thumbBuffer = await drawToImage({
      notes: getThumbnailNotes(nbsSong),
      startTick: startTick,
      startLayer: startLayer,
      zoomLevel: zoomLevel,
      backgroundColor: backgroundColor,
      imgWidth: 1280,
      imgHeight: 768,
    });

    // Upload thumbnail
    let thumbUrl: string;
    try {
      thumbUrl = await this.fileService.uploadThumbnail(
        thumbBuffer,
        `${publicId}.jpg`,
      );
      this.logger.log(fileKey);
    } catch (e) {
      throw new HttpException(
        {
          error: {
            file: "An error occurred while creating the song's thumbnail",
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    this.logger.log(thumbUrl);
    return thumbUrl;
  }

  private async uploadSongFile(file: Express.Multer.File) {
    let fileKey: string;
    try {
      fileKey = await this.fileService.uploadSong(file);
    } catch (e) {
      throw new HttpException(
        {
          error: {
            file: 'An error occurred while uploading the file',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return fileKey;
  }

  private getSongObject(loadedArrayBuffer: ArrayBuffer) {
    const nbsSong = fromArrayBuffer(loadedArrayBuffer);
    // If the above operation fails, it will return an empty song
    if (nbsSong.length === 0) {
      throw new HttpException(
        {
          error: {
            file: 'Invalid NBS file',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return nbsSong;
  }

  private checkIsFileValid(file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(
        {
          error: {
            file: 'File not found',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

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
    // Update song document
    foundSong.title = body.title;
    foundSong.originalAuthor = body.originalAuthor;
    foundSong.description = body.description;
    foundSong.category = body.category;
    foundSong.allowDownload = body.allowDownload;
    foundSong.visibility = body.visibility;
    foundSong.license = body.license;
    foundSong.customInstruments = body.customInstruments;
    foundSong.thumbnailData = body.thumbnailData;
    foundSong._sounds = body.customInstruments;
    // Update NBS file with form values
    //TODO: Update song metadata
    const songFile = await this.fileService.getSongFile(foundSong.nbsFileUrl);
    const nbsSong = fromArrayBuffer(songFile);
    this.updateSongFileMetadata(nbsSong, body, user);
    //TODO: Generate thumbnail
    const thumbUrl = await this.generateThumbnail(
      body.thumbnailData,
      nbsSong,
      foundSong.publicId,
      foundSong.nbsFileUrl,
    );
    //TODO: update song document
    foundSong.thumbnailUrl = thumbUrl;
    // Save song document
    const updatedSong = await foundSong.save();
    const populatedSong = (await updatedSong.populate(
      'uploader',
      'username profileImage -_id',
    )) as unknown as SongWithUser;
    return UploadSongResponseDto.fromSongWithUserDocument(populatedSong);
  }

  public async getSongByPage(query: PageQueryDTO): Promise<SongPreviewDto[]> {
    const { page, limit, sort, order, timespan } = query;
    const now = new Date();
    const timespanMap: Record<TimespanType, Date> = {
      hour: new Date(now.getTime() - 1000 * 60 * 60),
      day: new Date(now.getTime() - 1000 * 60 * 60 * 24),
      week: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7),
      month: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30),
      year: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365),
      all: new Date(0),
    };

    const data = (await this.songModel
      .find({
        visibility: 'public',
        createdAt: { $gte: timespanMap[timespan] },
      })
      .sort({
        [sort]: order ? -1 : 1,
      })
      .skip(page * limit - limit)
      .limit(limit)
      .populate('uploader', 'username profileImage -_id')
      .exec()) as unknown as SongWithUser[];
    return data.map((song) => SongPreviewDto.fromSongDocumentWithUser(song));
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
    const page = parseInt(query.page.toString()) || 1;
    const limit = parseInt(query.limit.toString()) || 10;
    const order = query.order ? query.order : false;
    const sort = query.sort ? query.sort : 'createdAt';
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
