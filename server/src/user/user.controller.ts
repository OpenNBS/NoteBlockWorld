import { Controller, Inject, Get, Patch, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GetRequestToken, validateUser } from '@server/GetRequestUser';
import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';
import { GetUser } from '@shared/validation/user/dto/GetUser.dto';
import { UpdateUsernameDto } from '@shared/validation/user/dto/UpdateUsername.dto';

import { UserDocument } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @Get('by-query')
  async getUser(@Query() query: GetUser) {
    return await this.userService.getUserByEmailOrId(query);
  }

  @Get('paginated')
  async getUserPaginated(@Query() query: PageQueryDTO) {
    return await this.userService.getUserPaginated(query);
  }

  @Get('me')
  @ApiTags('user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the token owner data' })
  async getMe(@GetRequestToken() user: UserDocument | null) {
    user = validateUser(user);
    return await this.userService.getSelfUserData(user);
  }

  @Patch('username')
  @ApiTags('user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the username' })
  async updateUsername(
    @GetRequestToken() user: UserDocument | null,
    @Body() body: UpdateUsernameDto,
  ) {
    user = validateUser(user);
    return await this.userService.updateUsername(user, body);
  }
}
