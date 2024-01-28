import * as NBS from '@encode42/nbs.js';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PageQuery } from '@server/common/dto/PageQuery.dto';
import { UserDocument } from '@server/user/entity/user.entity';
import { UserService } from '@server/user/user.service';
import { Model } from 'mongoose';
import { GetSongQueryDto } from './dto/GetSongQuery.dto';
import { SongDto } from './dto/Song.dto';
import { SongPreviewDto } from './dto/SongPreview.dto';
import { SongViewDto } from './dto/SongView.dto';
import { UploadSongDto } from './dto/UploadSongDto.dto';
import { Song } from './entity/song.entity';
@Injectable()
export class SongService {
  private logger = new Logger(SongService.name);
  constructor(
    @InjectModel(Song.name)
    private songModel: Model<Song>,
    @Inject(UserService)
    private userService: UserService,
  ) {}
  public async uploadSong({
    songId,
    file,
    user,
  }: {
    songId: string;
    file: Express.Multer.File;
    user: UserDocument | null;
  }): Promise<UploadSongDto> {
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const foundSong = await this.songModel.findById(songId).exec();
    if (!foundSong) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }
    // is song from user?
    if (foundSong.uploader.toString() !== user._id.toString()) {
      throw new HttpException('Song not found', HttpStatus.I_AM_A_TEAPOT);
    }
    // is song already uploaded?
    if (foundSong.content) {
      throw new HttpException('Song already uploaded', HttpStatus.CONFLICT);
    }
    const loadedArrayBuffer = new ArrayBuffer(file.buffer.byteLength);
    const view = new Uint8Array(loadedArrayBuffer);
    for (let i = 0; i < file.buffer.byteLength; ++i) {
      view[i] = file.buffer[i];
    }
    // is a valid file?
    const nbsSong = NBS.fromArrayBuffer(loadedArrayBuffer);
    const { length, nbsVersion, meta, errors } = nbsSong;
    this.logger.log({ length, nbsVersion, meta, errors });
    const arrayBuffer = nbsSong.arrayBuffer;
    if (!arrayBuffer) {
      throw new HttpException('Invalid file', HttpStatus.BAD_REQUEST);
    }
    const newBuffer = Buffer.from(arrayBuffer);
    const layers = nbsSong.layers.map((layer) => layer.notes);
    const noteCount = layers.reduce((acc, layer) => acc + layer.length, 0);

    // update song document
    foundSong.content = newBuffer;
    foundSong.duration = nbsSong.length / 20;
    foundSong.tempo = nbsSong.tempo;
    foundSong.noteCount = noteCount;
    const createdSong = await foundSong.save();
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
    foundSong.visibility = body.visibility;
    foundSong.title = body.title;
    foundSong.originalAuthor = body.originalAuthor;
    foundSong.description = body.description;

    const createdSong = await foundSong.save();
    return UploadSongDto.fromSongDocument(createdSong);
  }
  public async createSong(
    body: UploadSongDto,
    user: UserDocument | null,
  ): Promise<SongDto> {
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    // verify if song already exists, same title, same author
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
    const song = new Song();
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
    return SongDto.fromSongDocument(createdSong);
  }
  public async getSongByPage(query: PageQuery): Promise<SongPreviewDto[]> {
    const { page, limit } = query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };
    const data = await this.songModel
      .find()
      .skip(options.limit * (options.page - 1))
      .limit(options.limit)
      .exec();
    return data.map((song) => SongPreviewDto.fromSongDocument(song));
  }
  public async getSong(
    query: GetSongQueryDto,
    user: UserDocument | null,
  ): Promise<SongViewDto> {
    const { id } = query;
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
}
