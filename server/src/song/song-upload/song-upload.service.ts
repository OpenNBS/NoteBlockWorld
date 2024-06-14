import { Song, fromArrayBuffer } from '@encode42/nbs.js';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

  public async validateUploader(user: UserDocument): Promise<Types.ObjectId> {
    const uploader = await this.userService.findByID(user._id.toString());

    if (!uploader) {
      throw new HttpException(
        'user not found, contact an administrator',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return uploader._id;
  }

  public async generateSongDocument(
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

    // PROCESS UPLOADED SONG
    // TODO: delete file from S3 if remainder of upload method fails

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

    // Create song document
    const song = await this.generateSongDocument(
      user,
      publicId,
      body,
      thumbUrl,
      fileKey,
      songStats,
    );

    return song;
  }

  public getSongStats(file: Express.Multer.File, nbsSong: Song) {
    //const noteCount = 0;
    //
    //const tempoChangerInstruments: Instrument[] = [];
    //
    //for (const instrument of nbsSong.instruments.loaded) {
    //  if (instrument.meta.name === 'Tempo Changer') {
    //    tempoChangerInstruments.push(instrument);
    //  }
    //}
    //
    //for (const tick in Array(nbsSong.length).keys()) {
    //  for (const layer of nbsSong.layers) {
    //   const note = layer.notes[tick];
    //}

    return {
      fileSize: file.size,
      midiFileName: nbsSong.importName || '',
      noteCount: 0, // TODO(Bentroen): calculate,
      tickCount: nbsSong.length,
      layerCount: nbsSong.layers.length,
      tempo: nbsSong.tempo,
      timeSignature: nbsSong.timeSignature,
      duration: nbsSong.length / nbsSong.tempo, // TODO(Bentroen): take tempo changers into account
      loop: nbsSong.loop.enabled,
      loopStartTick: nbsSong.loop.startTick,
      minutesSpent: nbsSong.minutesSpent,
      usesCustomInstruments: false, // TODO(Bentroen): check if song.instruments.length > firstCustomIndex
      isInOctaveRange: false, // TODO(Bentroen): check if any(note => note.pitch < 33 || note.pitch > 57)
      compatible: false, //TODO(Bentroen): usesCustomInstruments && isInOctaveRange,
    };
  }

  public updateSongFileMetadata(
    nbsSong: Song,
    body: UploadSongDto,
    user: UserDocument,
  ) {
    nbsSong.name = removeNonAscii(body.title);
    nbsSong.author = removeNonAscii(user.username);
    nbsSong.originalAuthor = removeNonAscii(body.originalAuthor);
    nbsSong.description = removeNonAscii(body.description);
  }

  public async generateThumbnail(
    thumbnailData: ThumbnailData,
    nbsSong: Song,
    publicId: string,
    fileKey: string,
  ) {
    const { startTick, startLayer, zoomLevel, backgroundColor } = thumbnailData;

    const thumbBuffer = await drawToImage({
      notes: [], //getThumbnailNotes(nbsSong),
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

  public async uploadSongFile(file: Express.Multer.File) {
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

  public checkIsFileValid(file: Express.Multer.File) {
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
