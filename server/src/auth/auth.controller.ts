import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Get('login/github')
  @UseGuards(AuthGuard('github'))
  public githubLogin() {
    // Not need for implementation, its handled by passport
    this.logger.log('GitHub login');
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  public githubRedirect(@Req() req: Request, @Res() res: Response) {
    return this.authService.githubLogin(req, res);
  }

  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  public googleLogin() {
    // Not need for implementation, its handled by passport
    this.logger.log('Google login');
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  public googleRedirect(@Req() req: Request, @Res() res: Response) {
    return this.authService.googleLogin(req, res);
  }

  @Get('verify')
  @ApiOperation({ summary: 'Verify user token' })
  @ApiResponse({ status: 200, description: 'User token verified' })
  @ApiResponse({ status: 401, description: 'User token not verified' })
  @UseGuards(AuthGuard('jwt-refresh'))
  public verify(
    @Req() req: Request,
    @Res({
      passthrough: true,
    })
    res: Response,
  ) {
    // Not need for implementation, its handled by passport
    this.authService.verifyToken(req, res);
  }
}
