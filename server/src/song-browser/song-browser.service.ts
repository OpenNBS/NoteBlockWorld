import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';
import { FeaturedSongsDto } from '@shared/validation/song/dto/FeaturedSongsDto.dtc';
import { SongPreviewDto } from '@shared/validation/song/dto/SongPreview.dto';
import { TimespanType } from '@shared/validation/song/dto/types';

import { SongService } from '@server/song/song.service';

import { SongWithUser } from '../song/entity/song.entity';

@Injectable()
export class SongBrowserService {
  constructor(
    @Inject(SongService)
    private songService: SongService,
  ) {}

  public async getFeaturedSongs(): Promise<FeaturedSongsDto> {
    const now = new Date(Date.now());

    const times: Record<TimespanType, number> = {
      hour: new Date(Date.now()).setHours(now.getHours() - 1),
      day: new Date(Date.now()).setDate(now.getDate() - 1),
      week: new Date(Date.now()).setDate(now.getDate() - 7),
      month: new Date(Date.now()).setMonth(now.getMonth() - 1),
      year: new Date(Date.now()).setFullYear(now.getFullYear() - 1),
      all: new Date(0).getTime(),
    };

    const songs: Record<TimespanType, SongWithUser[]> = {
      hour: [],
      day: [],
      week: [],
      month: [],
      year: [],
      all: [],
    };

    for (const [timespan, time] of Object.entries(times)) {
      songs[timespan as TimespanType] =
        await this.songService.getSongsForTimespan(time);
    }

    const featuredSongs = FeaturedSongsDto.create();
    featuredSongs.hour = songs.hour;
    featuredSongs.day = songs.day;
    featuredSongs.week = songs.week;
    featuredSongs.month = songs.month;
    featuredSongs.year = songs.year;
    featuredSongs.all = songs.all;

    return featuredSongs;
  }
  public async getRecentSongs(query: PageQueryDTO): Promise<SongPreviewDto[]> {
    const { page, limit } = query;

    if (!page || !limit) {
      throw new HttpException(
        'Invalid query parameters',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.songService.getRecentSongs(page, limit);
  }
}
