import { fromArrayBuffer } from '@encode42/nbs.js';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { drawToImage, getThumbnailNotes } from '@shared/features/thumbnail';
import { Model, Types } from 'mongoose';

import { PageQuery } from '@server/common/dto/PageQuery.dto';
import { FileService } from '@server/file/file.service';
import { UserDocument } from '@server/user/entity/user.entity';
import { UserService } from '@server/user/user.service';

import { SongPageDto } from './dto/SongPageDto';
import { SongPreviewDto } from './dto/SongPreview.dto';
import { SongViewDto } from './dto/SongView.dto';
import { UploadSongDto } from './dto/UploadSongDto.dto';
import { Song as SongEntity } from './entity/song.entity';
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
  }): Promise<UploadSongDto> {
    // Is user valid?
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

    // Is file valid?
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

    // Load file into memory
    const loadedArrayBuffer = new ArrayBuffer(file.buffer.byteLength);
    const view = new Uint8Array(loadedArrayBuffer);
    for (let i = 0; i < file.buffer.byteLength; ++i) {
      view[i] = file.buffer[i];
    }

    // Is the uploaded file a valid .nbs file?
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

    // Upload file
    let fileKey: string;
    try {
      fileKey = await this.fileService.uploadSong(file);
      console.log(fileKey);
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

    // PROCESS UPLOADED SONG
    // TODO: delete file from S3 if remainder of upload method fails

    // Extract form values
    const {
      title,
      originalAuthor,
      description,
      allowDownload,
      visibility,
      category,
      coverData,
      customInstruments,
    } = body;

    // const category = body.category;

    // Generate song public ID
    const publicId = generateSongId();

    // Calculate song document's data from NBS file
    const fileSize = file.size;
    const midiFileName = nbsSong.meta.importName || '';
    const noteCount = 0; // TODO: calculate
    const tickCount = nbsSong.length;
    const layerCount = nbsSong.layers.length;
    const tempo = nbsSong.tempo;
    const timeSignature = nbsSong.timeSignature;
    const duration = tickCount / tempo; // TODO: take tempo changers into account
    const loop = nbsSong.loop.enabled;
    const loopStartTick = nbsSong.loop.startTick;
    const minutesSpent = nbsSong.stats.minutesSpent;

    const usesCustomInstruments = false; // TODO: check if song.instruments.length > firstCustomIndex
    const isInOctaveRange = false; // TODO: check if any(note => note.pitch < 33 || note.pitch > 57)
    const compatible = usesCustomInstruments && isInOctaveRange;

    // Update NBS file with form values
    nbsSong.meta.name = removeNonAscii(body.title);
    nbsSong.meta.author = removeNonAscii(user.username);
    nbsSong.meta.originalAuthor = removeNonAscii(body.originalAuthor);
    nbsSong.meta.description = removeNonAscii(body.description);

    // Generate thumbnail
    const { startTick, startLayer, zoomLevel, backgroundColor } = coverData;

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
      console.log(fileKey);
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
    console.log(thumbUrl);

    // Update song document

    const song = new SongEntity();
    song.uploader = await this.validateUploader(user);
    song.publicId = publicId;
    song.title = title;
    song.originalAuthor = originalAuthor;
    song.description = description;
    song.category = category;
    song.allowDownload = true || allowDownload; //TODO: implement allowDownload;
    song.visibility = visibility === 'private' ? 'private' : 'public';

    song.thumbnailData = coverData;
    song._sounds = customInstruments; // TODO: validate custom instruments
    song.thumbnailUrl = thumbUrl;
    song.nbsFileUrl = fileKey; // s3File.Location;

    // Song stats
    song.fileSize = fileSize;
    song.compatible = compatible;
    song.midiFileName = midiFileName;
    song.noteCount = noteCount;
    song.tickCount = tickCount;
    song.layerCount = layerCount;
    song.tempo = tempo;
    song.timeSignature = timeSignature;
    song.duration = duration;
    song.loop = loop;
    song.loopStartTick = loopStartTick;
    song.minutesSpent = minutesSpent;

    // Save song document
    const songDocument = await this.songModel.create(song);
    const createdSong = await songDocument.save();

    return UploadSongDto.fromSongDocument(createdSong);
  }

  public async deleteSong(id: string): Promise<UploadSongDto> {
    const foundSong = await this.songModel.findById(id).exec();
    if (!foundSong) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }
    await this.songModel.deleteOne({ _id: id }).exec();
    return UploadSongDto.fromSongDocument(foundSong);
  }

  public async patchSong(
    id: string,
    body: UploadSongDto,
    user: UserDocument | null,
  ): Promise<UploadSongDto> {
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const foundSong = await this.songModel.findById(id).exec();
    if (!foundSong) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }
    // is song from user?
    if (foundSong.uploader.toString() !== user._id.toString()) {
      throw new HttpException('Song not found', HttpStatus.I_AM_A_TEAPOT);
    }
    foundSong.allowDownload = body.allowDownload;
    foundSong.visibility = body.visibility == 'private' ? 'private' : 'public';
    foundSong.title = body.title;
    foundSong.originalAuthor = body.originalAuthor;
    foundSong.description = body.description;

    const createdSong = await foundSong.save();
    return UploadSongDto.fromSongDocument(createdSong);
  }

  public async getSongByPage(query: PageQuery): Promise<SongPreviewDto[]> {
    const { skip, limit } = query;
    const options = {
      skip: skip || 0,
      limit: limit || 10,
      sort: query.sort || 'createdAt',
      order: query.order || false,
    };
    const data = await this.songModel
      .find({
        visibility: 'public',
      })
      .sort({
        createdAt: options.order ? 'asc' : 'desc',
      })
      .skip(options.skip)
      .limit(options.limit)
      .populate('uploader', 'username profileImage -_id')
      .exec();
    return data.map((song) => SongPreviewDto.fromSongDocument(song));
  }

  public async getSong(
    id: string,
    user: UserDocument | null,
  ): Promise<SongViewDto> {
    const foundSong = await this.songModel
      .findOne({ publicId: id })
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
    id: string,
    user: UserDocument | null,
  ): Promise<string> {
    console.log(id);
    const foundSong = await this.songModel.findOne({ publicId: id }).exec();
    if (!foundSong) {
      console.log('Song not found');
      throw new HttpException('Song not found with ID', HttpStatus.NOT_FOUND);
    }
    if (foundSong.visibility !== 'public') {
      if (!user || foundSong.uploader.toString() !== user._id.toString()) {
        console.log("Song is private and user isn't the uploader");
        throw new HttpException(
          'This song is private',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
    if (!foundSong.allowDownload) {
      console.log('Song has downloads disabled');
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
      console.log(url);
      // increment download count
      foundSong.downloadCount++;
      await foundSong.save();
      return url;
    } catch (e) {
      console.error('Error getting song file', e);
      throw new HttpException(
        'An error occurred while retrieving the song file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getMySongsPage(arg0: {
    query: PageQuery;
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
    const songData = await this.songModel
      .find({
        uploader: user._id,
      })
      .sort({
        [sort]: order ? 1 : -1,
      })
      .skip(limit * (page - 1))
      .limit(limit)
      .exec();
    const total = await this.songModel
      .countDocuments({
        uploader: user._id,
      })
      .exec();

    return {
      content: songData.map((song) => SongPreviewDto.fromSongDocument(song)),
      page: page,
      limit: limit,
      total: total,
    };
  }
}
