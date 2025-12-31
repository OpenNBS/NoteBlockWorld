import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { UserDocument } from '@nbw/database';
import {
  GetUser,
  PageQueryDTO,
  UpdateUsernameDto,
  UserDto,
} from '@nbw/database';
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
    const { email, id, username } = query;

    if (email) {
      return await this.userService.findByEmail(email);
    }

    if (id) {
      return await this.userService.findByID(id);
    }

    if (username) {
      throw new HttpException(
        'Username is not supported yet',
        HttpStatus.BAD_REQUEST,
      );
    }

    throw new HttpException(
      'You must provide an email or an id',
      HttpStatus.BAD_REQUEST,
    );
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
    const userData = await this.userService.findByID(user._id.toString());
    if (!userData)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to the start of the day

    const lastSeenDate = new Date(userData.lastSeen);
    lastSeenDate.setHours(0, 0, 0, 0); // Set the time to the start of the day

    if (lastSeenDate < today) {
      userData.lastSeen = new Date();

      // if the last seen date is not yesterday, reset the login streak
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (lastSeenDate < yesterday) userData.loginStreak = 1;
      else {
        userData.loginStreak += 1;
        if (userData.loginStreak > userData.maxLoginStreak)
          userData.maxLoginStreak = userData.loginStreak;
      }

      userData.loginCount++;

      userData.save(); // no need to await this, we already have the data to send back
    } // if equal or greater, do nothing about the login streak

    return userData;
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
    let { username } = body;
    username = this.userService.normalizeUsername(username);

    if (await this.userService.usernameExists(username)) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.username === username) {
      throw new HttpException('Username is the same', HttpStatus.BAD_REQUEST);
    }

    user.username = username;
    user.lastEdited = new Date();

    await user.save();

    return UserDto.fromEntity(user);
  }
}
