import { Controller, Get, Query } from '@nestjs/common';
import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';

import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query() query: PageQueryDTO) {
    return await this.searchService.search(query);
  }
}
