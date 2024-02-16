import * as NBS from '@encode42/nbs.js';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PageQuery } from '@server/common/dto/PageQuery.dto';
import { UserDocument } from '@server/user/entity/user.entity';
import { UserService } from '@server/user/user.service';
import { Model } from 'mongoose';
import { SongDto } from './dto/Song.dto';
import { SongPageDto } from './dto/SongPageDto';
import { SongPreviewDto } from './dto/SongPreview.dto';
import { SongViewDto } from './dto/SongView.dto';
import { UploadSongDto } from './dto/UploadSongDto.dto';
import { SongDocument, Song as SongEntity } from './entity/song.entity';

@Injectable()
export class SongService {
  private logger = new Logger(SongService.name);
  constructor(
    @InjectModel(SongEntity.name)
    private songModel: Model<SongEntity>,
    @Inject(UserService)
    private userService: UserService,
  ) {}

  private async createSongDocument(
    body: UploadSongDto,
    user: UserDocument,
  ): Promise<SongDocument> {
    const foundSong = await this.songModel
      .findOne({
        title: body.title,
        originalAuthor: body.originalAuthor,
        uploader: user._id,
      })
      .exec();

    if (foundSong) {
      throw new HttpException(
        {
          message: 'Song already exists',
          song: SongDto.fromSongDocument(foundSong),
        },
        HttpStatus.CONFLICT,
      );
    }

    const { allowDownload, visibility, title, originalAuthor, description } =
      body;
    const song = new SongEntity();
    const uploader = await this.userService.findByID(user._id.toString());
    if (!uploader) {
      throw new HttpException(
        'user not found, contact an administrator',
        HttpStatus.UNAUTHORIZED,
      );
    }
    song.uploader = uploader._id as any;
    song.allowDownload = allowDownload;
    song.visibility = visibility;
    song.title = title;
    song.originalAuthor = originalAuthor;
    song.description = description;
    const createdSong = await this.songModel.create(song);
    return createdSong;
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
    const nbsSong = NBS.fromArrayBuffer(loadedArrayBuffer);
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

    // PROCESS UPLOADED SONG

    // Extract form values
    const title = body.title;
    const originalAuthor = body.originalAuthor;
    const description = body.description;
    const allowDownload = body.allowDownload;
    const visibility = body.visibility;
    // const category = body.category;

    // Calculate song document's data from NBS file
    const fileSize = file.size;
    const midiFileName = nbsSong.importName || '';
    const noteCount = 0; // TODO: calculate
    const tickCount = nbsSong.length;
    const layerCount = nbsSong.layers.get.length;
    const tempo = nbsSong.tempo;
    const timeSignature = nbsSong.timeSignature;
    const duration = tickCount / tempo; // TODO: take tempo changers into account
    const loop = nbsSong.loop.enabled;
    const loopStartTick = nbsSong.loop.startTick;
    const minutesSpent = nbsSong.minutesSpent;

    const usesCustomInstruments = false; // TODO: check if song.instruments.length > firstCustomIndex
    const isInOctaveRange = false; // TODO: check if any(note => note.pitch < 33 || note.pitch > 57)
    const compatible = usesCustomInstruments && isInOctaveRange;

    // Update NBS file with form values
    nbsSong.name = removeNonAscii(body.title);
    nbsSong.author = removeNonAscii(user.username);
    nbsSong.originalAuthor = removeNonAscii(body.originalAuthor);
    nbsSong.description = removeNonAscii(body.description);

    // Update song document
    const songDocument = await this.createSongDocument(body, user);
    // TODO: the following fields are already implemented in createSongDocument. Move them here?
    songDocument.title = title;
    songDocument.originalAuthor = originalAuthor;
    songDocument.description = description;
    songDocument.allowDownload = allowDownload;
    songDocument.visibility = visibility;
    //songDocument.fileSize = fileSize;
    //songDocument.compatible = compatible;
    //songDocument.midiFileName = midiFileName;
    songDocument.noteCount = noteCount;
    //songDocument.tickCount = tickCount;
    //songDocument.layerCount = layerCount;
    songDocument.tempo = tempo;
    //songDocument.timeSignature = timeSignature;
    songDocument.duration = duration;
    //songDocument.loop = loop;
    //songDocument.loopStartTick = loopStartTick;
    //songDocument.minutesSpent = minutesSpent;

    // Save song document
    const createdSong = await songDocument.save();

    return UploadSongDto.fromSongDocument(songDocument);
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
    foundSong.visibility = body.visibility;
    foundSong.title = body.title;
    foundSong.originalAuthor = body.originalAuthor;
    foundSong.description = body.description;

    const createdSong = await foundSong.save();
    return UploadSongDto.fromSongDocument(createdSong);
  }

  public async getSongByPage(query: PageQuery): Promise<SongPreviewDto[]> {
    const { page, limit } = query;
    const options = {
      page: page || 1,
      limit: limit || 10,
    };
    const data = await this.songModel
      .find()
      .skip(options.limit * (options.page - 1))
      .limit(options.limit)
      .exec();
    return data.map((song) => SongPreviewDto.fromSongDocument(song));
  }

  public async getSong(
    id: string,
    user: UserDocument | null,
  ): Promise<SongViewDto> {
    const foundSong = await this.songModel.findById(id).exec();
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
    return SongViewDto.fromSongDocument(foundSong);
  }

  public async getSongFile(
    id: string,
    user: UserDocument | null,
  ): Promise<StreamableFile> {
    const foundSong = await this.songModel.findById(id).exec();
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
    if (!foundSong.rawFile) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }
    const buffer = Buffer.from(foundSong.rawFile);
    const streamableFile = new StreamableFile(buffer, {
      type: 'audio/nbs',
      disposition: 'attachment',
      length: buffer.length,
    });
    return streamableFile;
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
