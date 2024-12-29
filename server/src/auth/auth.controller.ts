import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NewEmailUserDto } from '@shared/validation/user/dto/NewEmailUser.dto';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register user and send a email with a single use login link',
  })
  public async register(@Body() registerDto: NewEmailUserDto) {
    return this.authService.register(registerDto);
  }

  @Get('login/email')
  @ApiOperation({
    summary: 'Will send the user a email with a single use login link',
  })
  @UseGuards(AuthGuard('email'))
  public async signInWithEmail() {
    // Not need for implementation, its handled by passport
    this.logger.debug('Email login');
  }

  @Post('email/callback')
  @ApiOperation({
    summary: 'Will send the user a email with a single use login link',
  })
  public async signIn(@Req() req: Request, @Res() res: Response) {
    return this.authService.loginWithEmail(req, res);
  }

  @Get('login/github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Login with github' })
  public githubLogin() {
    // Not need for implementation, its handled by passport
    this.logger.debug('GitHub login');
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  public githubRedirect(@Req() req: Request, @Res() res: Response) {
    return this.authService.githubLogin(req, res);
  }

  @Get('login/google')
  @ApiOperation({ summary: 'Login with google' })
  @UseGuards(AuthGuard('google'))
  public googleLogin() {
    // Not need for implementation, its handled by passport
    this.logger.debug('Google login');
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google login callback' })
  @UseGuards(AuthGuard('google'))
  public googleRedirect(@Req() req: Request, @Res() res: Response) {
    return this.authService.googleLogin(req, res);
  }

  @Get('login/discord')
  @ApiOperation({ summary: 'Login with discord' })
  @UseGuards(AuthGuard('discord'))
  public discordLogin() {
    // Not need for implementation, its handled by passport
    this.logger.debug('Discord login');
  }

  @Get('discord/callback')
  @ApiOperation({ summary: 'Discord login callback' })
  @UseGuards(AuthGuard('discord'))
  public discordRedirect(@Req() req: Request, @Res() res: Response) {
    return this.authService.discordLogin(req, res);
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
    this.authService.verifyToken(req, res);
  }
}
