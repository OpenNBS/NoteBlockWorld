import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageQueryDTO, SongPageDto } from '@nbw/database';

import { GetRequestToken, validateUser } from '@server/lib/GetRequestUser';
import type { UserDocument } from '@server/user/entity/user.entity';

import { SongService } from '../song.service';

@UseGuards(AuthGuard('jwt-refresh'))
@Controller('my-songs')
@ApiTags('song')
export class MySongsController {
  constructor(public readonly songService: SongService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get a list of songs uploaded by the current authenticated user',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-refresh'))
  public async getMySongsPage(
    @Query() query: PageQueryDTO,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<SongPageDto> {
    user = validateUser(user);
    return await this.songService.getMySongsPage({
      query,
      user,
    });
  }
}
