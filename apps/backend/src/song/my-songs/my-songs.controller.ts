import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { UserDocument } from '@nbw/database';
import type { SongPageDto } from '@nbw/validation';
import { GetRequestToken, validateUser } from '@server/lib/GetRequestUser';
import { PageQueryDto } from '@server/zod-dto';

import { SongService } from '../song.service';

@UseGuards(AuthGuard('jwt-refresh'))
@Controller('my-songs')
@ApiTags('song')
export class MySongsController {
  constructor(
    @Inject(SongService)
    public readonly songService: SongService,
  ) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get a list of songs uploaded by the current authenticated user',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-refresh'))
  public async getMySongsPage(
    @Query() query: PageQueryDto,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<SongPageDto> {
    user = validateUser(user);
    return await this.songService.getMySongsPage({
      query,
      user,
    });
  }
}
