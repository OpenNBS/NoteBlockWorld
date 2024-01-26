import { Injectable } from '@nestjs/common';
import { PageQuery } from '@server/common/dto/PageQuery.dto';
import { DeleteSongDto } from './dto/DeleteSong.dto';
import { GetSongQueryDto } from './dto/GetSongQuery.dto';
import { UploadSongDto } from './dto/UploadSongDto.dto';

@Injectable()
export class SongService {
  public verifySongName(name: string): boolean | PromiseLike<boolean> {
    throw new Error('Method not implemented.');
  }
  public uploadSong(
    id: string,
    file: Express.Multer.File,
  ): UploadSongDto | PromiseLike<UploadSongDto> {
    throw new Error('Method not implemented.');
  }
  public deleteSong(
    body: DeleteSongDto,
  ): UploadSongDto | PromiseLike<UploadSongDto> {
    throw new Error('Method not implemented.');
  }
  public patchSong(
    body: UploadSongDto,
  ): UploadSongDto | PromiseLike<UploadSongDto> {
    throw new Error('Method not implemented.');
  }
  public createSong(
    body: UploadSongDto,
  ): UploadSongDto | PromiseLike<UploadSongDto> {
    throw new Error('Method not implemented.');
  }
  public getSongByPage(
    query: PageQuery,
  ): UploadSongDto[] | PromiseLike<UploadSongDto[]> {
    throw new Error('Method not implemented.');
  }
  public getSong(
    query: GetSongQueryDto,
  ): UploadSongDto | PromiseLike<UploadSongDto> {
    throw new Error('Method not implemented.');
  }
}
