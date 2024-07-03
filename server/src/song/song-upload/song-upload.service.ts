import { Song, fromArrayBuffer, toArrayBuffer } from '@encode42/nbs.js';
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

import { SongDocument, Song as SongEntity } from '../entity/song.entity';
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

    // Prepare song for upload
    const { nbsSong, songBuffer } = this.prepareSongForUpload(
      file.buffer,
      body,
      user,
    );

    // Prepare packed song for upload
    // This can generate a client error if the custom instruments are invalid, so it's done before the song is uploaded
    const packedSongBuffer = await this.preparePackedSongForUpload(
      nbsSong,
      body.customInstruments,
    );

    // Generate song public ID
    const publicId = generateSongId();

    // Upload song file
    const fileKey = await this.uploadSongFile(songBuffer, publicId);

    // Upload packed song file
    const packedFileKey = await this.uploadPackedSongFile(
      packedSongBuffer,
      publicId,
    );

    // PROCESS UPLOADED SONG
    // TODO: delete file from S3 if remainder of upload method fails

    // Calculate song document's data from NBS file
    const songStats = SongStatsGenerator.getSongStats(nbsSong);

    // Generate thumbnail
    const thumbUrl: string = await this.generateAndUploadThumbnail(
      body.thumbnailData,
      nbsSong,
      publicId,
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

  public async processSongPatch(
    songDocument: SongDocument,
    body: UploadSongDto,
    user: UserDocument,
  ) {
    // Compare arrays of custom instruments including order
    const customInstrumentsChanged =
      JSON.stringify(songDocument._sounds) !==
      JSON.stringify(body.customInstruments);

    const songMetadataChanged =
      customInstrumentsChanged ||
      songDocument.title !== body.title ||
      songDocument.originalAuthor !== body.originalAuthor ||
      // TODO: verify if song author matches current username
      // songDocument.uploader.username !== user.username &&
      songDocument.description !== body.description;

    // Compare thumbnail data
    const thumbnailChanged =
      JSON.stringify(songDocument.thumbnailData) !==
      JSON.stringify(body.thumbnailData);

    if (songMetadataChanged || thumbnailChanged) {
      // If either the thumbnail or the song metadata changed, we need to
      // download the existing song file to replace some fields and reupload it,
      // and/or regenerate and reupload the thumbnail

      const songFile = await this.fileService.getSongFile(
        songDocument.nbsFileUrl,
      );

      const originalSongBuffer = Buffer.from(songFile);

      // Regenerate song file + packed song file if metadata or custom instruments changed
      if (songMetadataChanged) {
        this.logger.log('Song metadata changed; reuploading song files');

        const { nbsSong, songBuffer } = this.prepareSongForUpload(
          originalSongBuffer,
          body,
          user,
        );

        // Obfuscate and pack song with updated custom instruments
        const packedSongBuffer = await this.preparePackedSongForUpload(
          nbsSong,
          body.customInstruments,
        );

        // Re-upload song file
        await this.uploadSongFile(songBuffer, songDocument.publicId);

        // Re-upload packed song file
        await this.uploadPackedSongFile(
          packedSongBuffer,
          songDocument.publicId,
        );
      }

      if (thumbnailChanged) {
        this.logger.log('Thumbnail data changed; re-uploading thumbnail');

        const nbsSong = this.getSongObject(originalSongBuffer);

        await this.generateAndUploadThumbnail(
          body.thumbnailData,
          nbsSong,
          songDocument.publicId,
        );
      }
    }
  }

  private prepareSongForUpload(
    buffer: Buffer,
    body: UploadSongDto,
    user: UserDocument,
  ) {
    const loadedArrayBuffer = new ArrayBuffer(buffer.byteLength);
    const view = new Uint8Array(loadedArrayBuffer);

    for (let i = 0; i < buffer.byteLength; ++i) {
      view[i] = buffer[i];
    }

    // Is the uploaded file a valid .nbs file?
    const nbsSong = this.getSongObject(loadedArrayBuffer);

    // Update NBS file with form values
    this.updateSongFileMetadata(
      nbsSong,
      body.title,
      user.username,
      body.originalAuthor,
      body.description,
    );

    const updatedSongArrayBuffer = toArrayBuffer(nbsSong);
    const songBuffer = Buffer.from(updatedSongArrayBuffer);

    return { nbsSong, songBuffer };
  }

  private async preparePackedSongForUpload(
    nbsSong: Song,
    soundsArray: string[],
  ) {
    // TODO: should fetch from the backend's static files, or from S3 bucket
    // TODO: cache this in memory on service setup for faster access?
    const response = await fetch('http://localhost:3000/data/soundList.json');
    const soundsMapping = (await response.json()) as Record<string, string>;

    this.validateCustomInstruments(soundsArray, soundsMapping);

    const packedSongBuffer = await obfuscateAndPackSong(
      nbsSong,
      soundsArray,
      soundsMapping,
    );

    return packedSongBuffer;
  }

  private validateCustomInstruments(
    soundsArray: string[],
    soundsMapping: Record<string, string>,
  ) {
    const isInstrumentValid = (sound: string) =>
      sound === '' || soundsMapping[sound] !== undefined;

    const areAllInstrumentsValid = soundsArray.every((sound) =>
      isInstrumentValid(sound),
    );

    if (!areAllInstrumentsValid) {
      throw new HttpException(
        {
          error: {
            customInstruments:
              'One or more invalid custom instruments have been set',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public updateSongFileMetadata(
    nbsSong: Song,
    title: string,
    author: string,
    originalAuthor: string,
    description: string,
  ) {
    // TODO: move song manipulation to shared module
    nbsSong.meta.name = removeNonAscii(title);
    nbsSong.meta.author = removeNonAscii(author);
    nbsSong.meta.originalAuthor = removeNonAscii(originalAuthor);
    nbsSong.meta.description = removeNonAscii(description);
  }

  public async generateAndUploadThumbnail(
    thumbnailData: ThumbnailData,
    nbsSong: Song,
    publicId: string,
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
      thumbUrl = await this.fileService.uploadThumbnail(thumbBuffer, publicId);
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

    this.logger.log(`Uploaded thumbnail to ${thumbUrl}`);

    return thumbUrl;
  }

  private async uploadSongFile(file: Buffer, publicId: string) {
    let fileKey: string;

    try {
      fileKey = await this.fileService.uploadSong(file, publicId);
    } catch (e) {
      throw new HttpException(
        {
          error: {
            file: 'An error occurred while uploading the packed song file',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    this.logger.log(`Uploaded song file to ${fileKey}`);

    return fileKey;
  }

  private async uploadPackedSongFile(file: Buffer, publicId: string) {
    let fileKey: string;

    try {
      fileKey = await this.fileService.uploadPackedSong(file, publicId);
    } catch (e) {
      throw new HttpException(
        {
          error: {
            file: 'An error occurred while uploading the song file',
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    this.logger.log(`Uploaded packed song file to ${fileKey}`);

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
