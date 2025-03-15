import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';
import { UpdateUserProfileDto } from '@shared/validation/user/dto/UpdateUserProfile.dto';
import { UserQuery } from '@shared/validation/user/dto/UserQuery.dto';

import { GetRequestToken, validateUser } from '@server/lib/GetRequestUser';

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

  @Get()
  @ApiTags('user')
  @ApiOperation({ summary: 'Get user data' })
  async getUser(
    @Query() query: UserQuery,
    @GetRequestToken() user: UserDocument | null,
  ) {
    if ('me' in query && query.me) {
      user = validateUser(user);
      return await this.userService.getSelfUserData(user);
    }

    return await this.userService.getUserPaginated(query as PageQueryDTO);
  }

  @Get(':username')
  @ApiTags('user')
  @ApiOperation({ summary: 'Get user profile by username' })
  async getUserProfile(@Param('username') username: string) {
    return await this.userService.findByUsername(username);
  }

  @Patch()
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
