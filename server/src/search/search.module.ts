import { Inject, Module } from '@nestjs/common';

import { SongModule } from '@server/song/song.module';
import { UserModule } from '@server/user/user.module';

import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [UserModule, SongModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {
  constructor(
    @Inject(SearchService)
    private readonly searchService: SearchService,
  ) {}

  onModuleInit() {
    this.searchService.createIndexes();
  }
}
