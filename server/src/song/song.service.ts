import { Injectable } from '@nestjs/common';
import {
  GetSongQueryDto,
  SongDto,
  PatchSongDto,
  DeleteSongDto,
} from './dto/index';

@Injectable()
export class SongService {
  deleteSong(body: DeleteSongDto): SongDto | PromiseLike<SongDto> {
    throw new Error('Method not implemented.');
  }
  patchSong(id: string, body: PatchSongDto): SongDto | PromiseLike<SongDto> {
    throw new Error('Method not implemented.');
  }
  createSong(body: SongDto): SongDto | PromiseLike<SongDto> {
    throw new Error('Method not implemented.');
  }
  getSongByPage(query: GetSongQueryDto): SongDto[] | PromiseLike<SongDto[]> {
    throw new Error('Method not implemented.');
  }
  getSong(query: GetSongQueryDto): SongDto | PromiseLike<SongDto> {
    throw new Error('Method not implemented.');
  }
}
