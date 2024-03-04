import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { PageQuery } from '@server/common/dto/PageQuery.dto';
import { GetRequestToken } from '@server/GetRequestUser';
import { UserDocument } from '@server/user/entity/user.entity';

import { SongPageDto } from '../dto/SongPageDto';
import { SongService } from '../song.service';

@UseGuards(AuthGuard('jwt-refresh'))
@Controller('my-songs')
export class MySongsController {
  constructor(public readonly songService: SongService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get a list of songs uploaded by the current authenticated user',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-refresh'))
  public async getMySongsPage(
    @Query() query: PageQuery,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<SongPageDto> {
    return await this.songService.getMySongsPage({
      query,
      user,
    });
  }
}
