import { Song, fromArrayBuffer, toArrayBuffer } from '@encode42/nbs.js';
import {
  SongDocument,
  Song as SongEntity,
  SongStats,
  ThumbnailData,
  UploadSongDto,
  UserDocument,
} from '@nbw/database';
import {
  NoteQuadTree,
  SongStatsGenerator,
  injectSongFileMetadata,
  obfuscateAndPackSong,
} from '@nbw/song';
import { drawToImage } from '@nbw/thumbnail';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Types } from 'mongoose';

import { FileService } from '@server/file/file.service';
import { UserService } from '@server/user/user.service';

import { generateSongId, removeExtraSpaces } from '../song.util';

@Injectable()
export class SongUploadService {
  private soundsMapping: Record<string, string>;
  private soundsSubset: Set<string>;

  // TODO: move all upload auxiliary methods to new UploadSongService
  private readonly logger = new Logger(SongUploadService.name);

  constructor(
    @Inject(FileService)
    private fileService: FileService,

    @Inject(UserService)
    private userService: UserService,
  ) {}

  private async getSoundsMapping(): Promise<Record<string, string>> {
    // Object that maps sound paths to their respective hashes

    if (!this.soundsMapping) {
      const response = await fetch(
        process.env.SERVER_URL + '/v1/data/soundList.json',
      );

      this.soundsMapping = (await response.json()) as Record<string, string>;
    }

    return this.soundsMapping;
  }

  private async getValidSoundsSubset() {
    // Creates a set of valid sound paths from the full list of sounds in Minecraft

    if (!this.soundsSubset) {
      try {
        const response = await fetch(
          process.env.SERVER_URL + '/v1/data/soundList.json',
        );

        const soundMapping = (await response.json()) as Record<string, string>;
        const soundList = Object.keys(soundMapping);
        this.soundsSubset = new Set(soundList);
      } catch (e) {
        throw new HttpException(
          {
            error: {
              file: 'An error occurred while retrieving sound list',
            },
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    return this.soundsSubset;
  }

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
  ): Promise<SongEntity> {
    const song = new SongEntity();
    song.uploader = await this.validateUploader(user);
    song.publicId = publicId;
    song.title = removeExtraSpaces(body.title);
    song.originalAuthor = removeExtraSpaces(body.originalAuthor);
    song.description = removeExtraSpaces(body.description);
    song.category = body.category;
    song.allowDownload = true || body.allowDownload; //TODO: implement allowDownload;
    song.visibility = body.visibility;
    song.license = body.license;

    // Pad custom instruments to number of instruments in the song, just for safety
    const customInstrumentCount =
      songStats.instrumentNoteCounts.length -
      songStats.firstCustomInstrumentIndex;

    const paddedInstruments = body.customInstruments.concat(
      Array(customInstrumentCount - body.customInstruments.length).fill(''),
    );

    song.customInstruments = paddedInstruments;
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
  ): Promise<void> {
    // Compare arrays of custom instruments including order
    const customInstrumentsChanged =
      JSON.stringify(songDocument.customInstruments) !==
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

        const nbsSong = this.getSongObject(songFile);

        await this.generateAndUploadThumbnail(
          body.thumbnailData,
          nbsSong,
          songDocument.publicId,
        );
      }
    }
  }

  private prepareSongForUpload(
    songFileBuffer: Buffer,
    body: UploadSongDto,
    user: UserDocument,
  ): { nbsSong: Song; songBuffer: Buffer } {
    const songFileArrayBuffer = songFileBuffer.buffer.slice(
      songFileBuffer.byteOffset,
      songFileBuffer.byteOffset + songFileBuffer.byteLength,
    ) as ArrayBuffer;

    // Is the uploaded file a valid .nbs file?
    const nbsSong = this.getSongObject(songFileArrayBuffer);

    // Update NBS file with form values
    injectSongFileMetadata(
      nbsSong,
      removeExtraSpaces(body.title),
      removeExtraSpaces(user.username),
      removeExtraSpaces(body.originalAuthor),
      removeExtraSpaces(body.description),
      body.customInstruments,
    );

    const updatedSongArrayBuffer = toArrayBuffer(nbsSong);
    const songBuffer = Buffer.from(updatedSongArrayBuffer);

    return { nbsSong, songBuffer };
  }

  private async preparePackedSongForUpload(
    nbsSong: Song,
    soundsArray: string[],
  ): Promise<Buffer> {
    const soundsMapping = await this.getSoundsMapping();
    const validSoundsSubset = await this.getValidSoundsSubset();

    this.validateCustomInstruments(soundsArray, validSoundsSubset);

    const packedSongBuffer = await obfuscateAndPackSong(
      nbsSong,
      soundsArray,
      soundsMapping,
    );

    return packedSongBuffer;
  }

  private validateCustomInstruments(
    soundsArray: string[],
    validSounds: Set<string>,
  ): void {
    const isInstrumentValid = (sound: string) =>
      sound === '' || validSounds.has(sound);

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

  public async generateAndUploadThumbnail(
    thumbnailData: ThumbnailData,
    nbsSong: Song,
    publicId: string,
  ): Promise<string> {
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

  private async uploadSongFile(
    file: Buffer,
    publicId: string,
  ): Promise<string> {
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

  private async uploadPackedSongFile(
    file: Buffer,
    publicId: string,
  ): Promise<string> {
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

  public getSongObject(loadedArrayBuffer: ArrayBuffer): Song {
    const nbsSong = fromArrayBuffer(loadedArrayBuffer);

    // If the above operation fails, it will return an empty song
    if (nbsSong.length === 0) {
      throw new HttpException(
        {
          error: {
            file: 'Invalid NBS file',
            errors: nbsSong.errors,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return nbsSong;
  }

  private checkIsFileValid(file: Express.Multer.File): void {
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
