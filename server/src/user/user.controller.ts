import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
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
  async getUser(@Query() query: any) {
    return await this.userService.getUserByEmailOrId(query);
  }

  @Get()
  @ApiTags('user')
  @ApiBearerAuth()
  async getUserPaginated(@Query() query: any) {
    return await this.userService.getUserPaginated(query);
  }
}
