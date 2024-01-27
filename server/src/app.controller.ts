import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { GetRequestToken } from './GetRequestUser';
import { AppService } from './app.service';
import { ParseTokenPipe } from './song/parseToken';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('secure')
  public getProtectedResource(
    @GetRequestToken() user: any,
    @Res() res: Response,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(this.appService.getSecureResource(user));
  }
}
