import { Controller, Get, Query } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { SearchQueryDTO } from '@shared/validation/common/dto/SearchQuery.dto';
import { SearchService } from './search.service';

@Controller('search')
@ApiTags('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query() query: SearchQueryDTO) {
    return await this.searchService.search(query);
  }
}
