import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';
import { SongPageDto } from '@shared/validation/song/dto/SongPageDto';

import { GetRequestToken } from '@server/GetRequestUser';
import { UserDocument } from '@server/user/entity/user.entity';
import { UserService } from '@server/user/user.service';

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
    @Query() query: PageQueryDTO,
    @GetRequestToken() user: UserDocument | null,
  ): Promise<SongPageDto> {
    user = UserService.verifyUser(user);
    return await this.songService.getMySongsPage({
      query,
      user,
    });
  }
}
