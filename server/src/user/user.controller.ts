import { Body, Controller, Get, Inject, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';
import { GetUser } from '@shared/validation/user/dto/GetUser.dto';
import { UpdateUsernameDto } from '@shared/validation/user/dto/UpdateUsername.dto';
import { UpdateUserProfileDto } from '@shared/validation/user/dto/UpdateUserProfile.dto';

import { GetRequestToken, validateUser } from '@server/GetRequestUser';

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

  @Patch('profile')
  @ApiTags('user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the profile' })
  async updateProfile(
    @GetRequestToken() user: UserDocument | null,
    @Body() body: UpdateUserProfileDto,
  ) {
    user = validateUser(user);
    return await this.userService.updateProfile(user, body);
  }
}
