import type { UserDocument } from '@nbw/database';
import { GetUser, PageQueryDTO, UpdateUsernameDto } from '@nbw/database';
import { Body, Controller, Get, Inject, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRequestToken, validateUser } from '@server/lib/GetRequestUser';
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
