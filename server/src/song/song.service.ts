import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PageQuery } from '@server/common/dto/PageQuery.dto';
import { Model } from 'mongoose';
import { GetSongQueryDto } from './dto/GetSongQuery.dto';
import { SongPreviewDto } from './dto/SongPreview.dto';
import { SongViewDto } from './dto/SongView.dto';
import { UploadSongDto } from './dto/UploadSongDto.dto';
import { Song } from './entity/song.entity';
import { UserDocument } from '@server/user/entity/user.entity';

@Injectable()
export class SongService {
  private logger = new Logger(SongService.name);
  constructor(@InjectModel(Song.name) private userModel: Model<Song>) {}
  public async uploadSong(
    songId: string,
    file: Express.Multer.File,
    user: UserDocument | null,
  ): Promise<UploadSongDto> {
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const foundSong = await this.userModel.findById(songId).exec();
    if (!foundSong) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }
    // is song from user?
    if (foundSong.uploader._id !== user._id) {
      throw new HttpException('Song not found', HttpStatus.I_AM_A_TEAPOT);
    }
    // is song already uploaded?
    if (foundSong.content) {
      throw new HttpException('Song already uploaded', HttpStatus.CONFLICT);
    }
    // is a valid file?
    if (!file) {
      // TODO: check file type , use the NBS js library. This should be done before in the multer middleware
      throw new HttpException('Invalid file', HttpStatus.BAD_REQUEST);
    }
    foundSong.content = file.buffer;
    const createdSong = await foundSong.save();
    return UploadSongDto.fromSongDocument(createdSong);
  }
  public async deleteSong(id: string): Promise<UploadSongDto> {
    const foundSong = await this.userModel.findById(id).exec();
    if (!foundSong) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }
    await this.userModel.deleteOne({ _id: id }).exec();
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
    const foundSong = await this.userModel.findById(id).exec();
    if (!foundSong) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }
    // is song from user?
    if (foundSong.uploader._id !== user._id) {
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
  ): Promise<UploadSongDto> {
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const song = new this.userModel(body);
    song.uploader = user;
    const createdSong = await song.save();
    return UploadSongDto.fromSongDocument(createdSong);
  }
  public async getSongByPage(query: PageQuery): Promise<SongPreviewDto[]> {
    const { page, limit } = query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };
    const data = await this.userModel
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
    const foundSong = await this.userModel.findById(id).exec();
    if (!foundSong) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }
    if (foundSong.visibility === 'private') {
      if (!user) {
        throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
      }
      if (foundSong.uploader._id !== user._id) {
        throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
      }
    }
    return SongViewDto.fromSongDocument(foundSong);
  }
}
