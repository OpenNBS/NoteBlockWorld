import { Inject, Injectable, Logger } from '@nestjs/common';
import { SearchQueryDTO } from '@shared/validation/common/dto/SearchQuery.dto';
import { SongViewDto } from '@shared/validation/song/dto/SongView.dto';
import { UserViewDto } from '@shared/validation/user/dto/UserView.dto';

import { SongService } from '@server/song/song.service';
import { UserService } from '@server/user/user.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(SongService)
    private readonly songService: SongService,
  ) {
    this.logger.log('SearchService instantiated');
  }

  public async search(queryBody: SearchQueryDTO) {
    this.logger.debug(`Searching for ${queryBody}`);

    const {
      query,
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = false,
      category,
      searchSongs,
      searchUsers,
    } = queryBody;

    const { users, total: totalUsers } = searchUsers
      ? await this.userService.search({
          ...queryBody,
        })
      : { users: [], total: 0 };

    const { songs, total: totalSongs } = searchSongs
      ? await this.songService.search({
          ...queryBody,
        })
      : { songs: [], total: 0 };

    return {
      users: users.map(
        ({ username, profileImage }) =>
          new UserViewDto({
            username,
            profileImage,
          }),
      ),
      songs: songs.map((song) => SongViewDto.fromSongDocument(song)),
      total: Math.max(totalUsers, totalSongs),
      query,
      page,
      limit,
      sort,
      order,
      category,
      searchSongs,
      searchUsers,
    };
  }

  public async createIndexes() {
    await this.userService.createSearchIndexes();
    await this.songService.createSearchIndexes();
  }
}
