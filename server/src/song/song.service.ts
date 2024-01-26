import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PageQuery } from '@server/common/dto/PageQuery.dto';
import { DeleteSongDto } from './dto/DeleteSong.dto';
import { GetSongQueryDto } from './dto/GetSongQuery.dto';
import { UploadSongDto } from './dto/UploadSongDto.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Song, SongDocument } from './entity/song.entity';
import { PartialType } from '@nestjs/swagger';
import { SongViewDto } from './dto/SongView.dto';

@Injectable()
export class SongService {
  private logger = new Logger(SongService.name);
  constructor(@InjectModel(Song.name) private userModel: Model<Song>) {}
  public async uploadSong(
    id: string,
    file: Express.Multer.File,
  ): Promise<UploadSongDto> {
    throw new Error('Method not implemented.');
  }
  public async deleteSong(body: DeleteSongDto): Promise<UploadSongDto> {
    throw new Error('Method not implemented.');
  }
  public async patchSong(
    id: string,
    body: UploadSongDto,
  ): Promise<UploadSongDto> {
    const foundSong = this.userModel.findById(id).exec();
    if (!foundSong) {
      throw new HttpException('Song not found', HttpStatus.NOT_FOUND);
    }
    const song = new this.userModel(body);
    const createdSong = await song.save();
    return UploadSongDto.fromSongDocument(createdSong);
  }
  public async createSong(body: UploadSongDto): Promise<UploadSongDto> {
    const song = new this.userModel(body);
    const createdSong = await song.save();
    return UploadSongDto.fromSongDocument(createdSong);
  }
  public async getSongByPage(query: PageQuery): Promise<UploadSongDto[]> {
    const { page, limit } = query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };
    return this.userModel.find({});
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
