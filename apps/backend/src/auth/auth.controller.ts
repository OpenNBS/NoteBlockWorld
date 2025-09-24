import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { MagicLinkEmailStrategy } from './strategies/magicLinkEmail.strategy';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(MagicLinkEmailStrategy)
    private readonly magicLinkEmailStrategy: MagicLinkEmailStrategy
  ) {}

  @Throttle({
    default: {
      // one every 1 hour
      ttl  : 60 * 60 * 1000,
      limit: 1
    }
  })
  @Post('login/magic-link')
  @ApiOperation({
    summary:
      'Will send the user a email with a single use login link, if the user does not exist it will create a new user',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type      : 'object',
            properties: {
              destination: {
                type       : 'string',
                example    : 'vycasnicolas@gmail.com',
                description: 'Email address to send the magic link to'
              }
            },
            required: ['destination']
          }
        }
      }
    }
  })
   
  public async magicLinkLogin(@Req() req: Request, @Res() res: Response) {
    throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
    // TODO: uncomment this line to enable magic link login
    //return this.magicLinkEmailStrategy.send(req, res);
  }

  @Get('magic-link/callback')
  @ApiOperation({
    summary: 'Will send the user a email with a single use login link'
  })
  @UseGuards(AuthGuard('magic-link'))
  public async magicLinkRedirect(@Req() req: Request, @Res() res: Response) {
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
  @ApiOperation({ summary: 'GitHub login callback' })
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
      passthrough: true
    })
    res: Response
  ) {
    this.authService.verifyToken(req, res);
  }
}
