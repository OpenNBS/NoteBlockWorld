import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PageQuery } from '@server/common/dto/PageQuery.dto';
import { Model } from 'mongoose';
import { GetSongQueryDto } from './dto/GetSongQuery.dto';
import { SongPreviewDto } from './dto/SongPreview.dto';
import { SongViewDto } from './dto/SongView.dto';
import { UploadSongDto } from './dto/UploadSongDto.dto';
import { Song } from './entity/song.entity';

@Injectable()
export class SongService {
  private logger = new Logger(SongService.name);
  constructor(@InjectModel(Song.name) private userModel: Model<Song>) {}
  public async uploadSong(
    id: string,
    file: Express.Multer.File,
  ): Promise<UploadSongDto> {
    const foundSong = await this.userModel.findById(id).exec();
    if (!foundSong) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
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
  ): Promise<UploadSongDto> {
    const foundSong = await this.userModel.findById(id).exec();
    if (!foundSong) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }
    foundSong.allowDownload = body.allowDownload;
    foundSong.visibility = body.visibility;
    foundSong.title = body.title;
    foundSong.originalAuthor = body.originalAuthor;
    foundSong.description = body.description;

    const createdSong = await foundSong.save();
    return UploadSongDto.fromSongDocument(createdSong);
  }
  public async createSong(body: UploadSongDto): Promise<UploadSongDto> {
    const song = new this.userModel(body);
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
  public async getSong(query: GetSongQueryDto): Promise<SongViewDto> {
    const { id } = query;
    const foundSong = await this.userModel.findById(id).exec();
    if (!foundSong) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }
    return SongViewDto.fromSongDocument(foundSong);
  }
}
