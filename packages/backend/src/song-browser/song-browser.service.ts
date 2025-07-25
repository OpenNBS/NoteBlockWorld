import {
  BROWSER_SONGS,
  FeaturedSongsDto,
  PageQueryDTO,
  SongPreviewDto,
  SongWithUser,
  TimespanType,
} from '@nbw/database';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SongService } from '@server/song/song.service';

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
      const songPage = await this.songService.getSongsForTimespan(time);

      // If the length is 0, send an empty array (no songs available in that timespan)
      // If the length is less than the page size, pad it with songs "borrowed"
      // from the nearest timestamp, regardless of view count
      if (
        songPage.length > 0 &&
        songPage.length < BROWSER_SONGS.paddedFeaturedPageSize
      ) {
        const missing = BROWSER_SONGS.paddedFeaturedPageSize - songPage.length;

        const additionalSongs = await this.songService.getSongsBeforeTimespan(
          time,
        );

        songPage.push(...additionalSongs.slice(0, missing));
      }

      songs[timespan as TimespanType] = songPage;
    }

    const featuredSongs = FeaturedSongsDto.create();

    featuredSongs.hour = songs.hour.map((song) =>
      SongPreviewDto.fromSongDocumentWithUser(song),
    );

    featuredSongs.day = songs.day.map((song) =>
      SongPreviewDto.fromSongDocumentWithUser(song),
    );

    featuredSongs.week = songs.week.map((song) =>
      SongPreviewDto.fromSongDocumentWithUser(song),
    );

    featuredSongs.month = songs.month.map((song) =>
      SongPreviewDto.fromSongDocumentWithUser(song),
    );

    featuredSongs.year = songs.year.map((song) =>
      SongPreviewDto.fromSongDocumentWithUser(song),
    );

    featuredSongs.all = songs.all.map((song) =>
      SongPreviewDto.fromSongDocumentWithUser(song),
    );

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

  public async getCategories(): Promise<Record<string, number>> {
    return await this.songService.getCategories();
  }

  public async getSongsByCategory(
    category: string,
    query: PageQueryDTO,
  ): Promise<SongPreviewDto[]> {
    return await this.songService.getSongsByCategory(
      category,
      query.page ?? 1,
      query.limit ?? 10,
    );
  }

  public async getRandomSongs(
    count: number,
    category: string,
  ): Promise<SongPreviewDto[]> {
    return await this.songService.getRandomSongs(count, category);
  }
}
