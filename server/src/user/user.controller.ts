import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';
import { GetUser } from '@shared/validation/user/dto/GetUser.dto';

import { GetRequestToken } from '@server/GetRequestUser';

import { UserDocument } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiTags('user')
  @ApiBearerAuth()
  async getUser(@Query() query: GetUser) {
    return await this.userService.getUserByEmailOrId(query);
  }

  @Get()
  @ApiTags('user')
  @ApiBearerAuth()
  async getUserPaginated(@Query() query: PageQueryDTO) {
    return await this.userService.getUserPaginated(query);
  }

  @Get('me')
  @ApiTags('user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the token owner data' })
  async getMe(@GetRequestToken() user: UserDocument | null) {
    user = UserService.verifyUser(user);
    return await this.userService.getSelfUserData(user);
  }
}
