import { Injectable } from '@nestjs/common';
import {
  GetSongQueryDto,
  SongDto,
  PatchSongDto,
  DeleteSongDto,
} from './dto/index';
import { PageQuery } from '@server/common/dto/PageQuery.dto';

@Injectable()
export class SongService {
  verifySongName(name: string): boolean | PromiseLike<boolean> {
    throw new Error('Method not implemented.');
  }
  uploadSong(
    id: string,
    file: Express.Multer.File,
  ): SongDto | PromiseLike<SongDto> {
    throw new Error('Method not implemented.');
  }
  public deleteSong(body: DeleteSongDto): SongDto | PromiseLike<SongDto> {
    throw new Error('Method not implemented.');
  }
  public patchSong(body: PatchSongDto): SongDto | PromiseLike<SongDto> {
    throw new Error('Method not implemented.');
  }
  public createSong(body: SongDto): SongDto | PromiseLike<SongDto> {
    throw new Error('Method not implemented.');
  }
  public getSongByPage(query: PageQuery): SongDto[] | PromiseLike<SongDto[]> {
    throw new Error('Method not implemented.');
  }
  public getSong(query: GetSongQueryDto): SongDto | PromiseLike<SongDto> {
    throw new Error('Method not implemented.');
  }
}
