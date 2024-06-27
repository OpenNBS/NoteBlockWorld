import { Song, fromArrayBuffer } from '@encode42/nbs.js';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NoteQuadTree } from '@shared/features/song/notes';
import { obfuscateAndPackSong } from '@shared/features/song/pack';
import { SongStats } from '@shared/features/song/SongStats';
import { SongStatsGenerator } from '@shared/features/song/stats';
import { drawToImage } from '@shared/features/thumbnail';
import { ThumbnailData } from '@shared/validation/song/dto/ThumbnailData.dto';
import { UploadSongDto } from '@shared/validation/song/dto/UploadSongDto.dto';
import { Model, Types } from 'mongoose';

import { FileService } from '@server/file/file.service';
import { UserDocument } from '@server/user/entity/user.entity';
import { UserService } from '@server/user/user.service';

import { Song as SongEntity } from '../entity/song.entity';
import { generateSongId, removeNonAscii } from '../song.util';

@Injectable()
export class SongUploadService {
  // TODO: move all upload auxiliary methods to new UploadSongService
  private logger = new Logger(SongUploadService.name);
  constructor(
    @Inject(FileService)
    private fileService: FileService,
    @InjectModel(SongEntity.name)
    private songModel: Model<SongEntity>,

    @Inject(UserService)
    private userService: UserService,
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

  private async generateSongDocument(
    user: UserDocument,
    publicId: string,
    body: UploadSongDto,
    thumbUrl: string,
    fileKey: string,
    packedFileKey: string,
    songStats: SongStats,
    file: Express.Multer.File,
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
    song.thumbnailUrl = thumbUrl;
    song.nbsFileUrl = fileKey; // s3File.Location;
    song.packedSongUrl = packedFileKey;
    song.stats = songStats;
    song.fileSize = file.size;

    return song;
  }

  public async processUploadedSong({
    file,
    user,
    body,
  }: {
    body: UploadSongDto;
    file: Express.Multer.File;
    user: UserDocument;
  }): Promise<SongEntity> {
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

    // Upload packed song file
    const soundsArray = body.customInstruments;

    // TODO: should fetch from the backend's static files, or from S3 bucket
    // TODO: cache this in memory on service setup for faster access?
    const response = await fetch('http://localhost:3000/data/soundList.json');
    const soundsMapping = (await response.json()) as Record<string, string>;

    const packedSongBuffer = await obfuscateAndPackSong(
      nbsSong,
      soundsArray,
      soundsMapping,
    );

    const packedFileObj = {
      buffer: packedSongBuffer,
      originalname: `${file.originalname.replace('.nbs', '')}.zip`,
      mimetype: 'application/zip',
    };

    const packedFileKey = await this.uploadSongFile(packedFileObj);

    // PROCESS UPLOADED SONG
    // TODO: delete file from S3 if remainder of upload method fails

    // Generate song public ID
    const publicId = generateSongId();

    // Calculate song document's data from NBS file
    const songStats = SongStatsGenerator.getSongStats(nbsSong);

    // Update NBS file with form values
    this.updateSongFileMetadata(nbsSong, body, user);

    // Generate thumbnail
    const thumbUrl: string = await this.generateThumbnail(
      body.thumbnailData,
      nbsSong,
      publicId,
      fileKey,
    );

    // Create song document
    const song = await this.generateSongDocument(
      user,
      publicId,
      body,
      thumbUrl,
      fileKey,
      packedFileKey, // TODO: should be packedFileUrl
      songStats,
      file,
    );

    return song;
  }

  public updateSongFileMetadata(
    nbsSong: Song,
    body: UploadSongDto,
    user: UserDocument,
  ) {
    // TODO: move song manipulation to shared module
    nbsSong.meta.name = removeNonAscii(body.title);
    nbsSong.meta.author = removeNonAscii(user.username);
    nbsSong.meta.originalAuthor = removeNonAscii(body.originalAuthor);
    nbsSong.meta.description = removeNonAscii(body.description);
  }

  public async generateThumbnail(
    thumbnailData: ThumbnailData,
    nbsSong: Song,
    publicId: string,
    fileKey: string,
  ) {
    const { startTick, startLayer, zoomLevel, backgroundColor } = thumbnailData;

    const quadTree = new NoteQuadTree(nbsSong);

    const thumbBuffer = await drawToImage({
      notes: quadTree,
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

  private async uploadSongFile(file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  }) {
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

  public getSongObject(loadedArrayBuffer: ArrayBuffer) {
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
}
