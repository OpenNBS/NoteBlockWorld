import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';

import { E2E_AUTH_HEADER } from '@nbw/config';
import { UserService } from '@server/user/user.service';

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
    private readonly magicLinkEmailStrategy: MagicLinkEmailStrategy,
    @Inject(UserService)
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Throttle({
    default: {
      // one every 1 hour
      ttl: 60 * 60 * 1000,
      limit: 1,
    },
  })
  @Post('login/magic-link')
  @ApiOperation({
    summary:
      'Will send the user a email with a single use login link, if the user does not exist it will create a new user',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              destination: {
                type: 'string',
                example: 'vycasnicolas@gmail.com',
                description: 'Email address to send the magic link to',
              },
            },
            required: ['destination'],
          },
        },
      },
    },
  })
  // eslint-disable-next-line unused-imports/no-unused-vars
  public async magicLinkLogin(@Req() req: Request, @Res() res: Response) {
    throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
    // TODO: uncomment this line to enable magic link login
    //return this.magicLinkEmailStrategy.send(req, res);
  }

  @Get('magic-link/callback')
  @ApiOperation({
    summary: 'Will send the user a email with a single use login link',
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

  /**
   * Development-only: mint JWT pair for an existing user so Cypress can `setCookie`
   * without UI login. Disabled unless `NODE_ENV === 'development'` and
   * `E2E_AUTH_SECRET` is non-empty; wrong/missing secret returns 404 to avoid
   * advertising the route.
   */
  @Post('e2e/session')
  @HttpCode(200)
  @SkipThrottle()
  @ApiExcludeEndpoint()
  public async e2eSession(
    @Headers(E2E_AUTH_HEADER) secret: string | undefined,
    @Body() body: { email?: string; userId?: string },
  ): Promise<{ access_token: string; refresh_token: string }> {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const expectedSecret = this.configService.get<string>('E2E_AUTH_SECRET');
    if (
      nodeEnv !== 'development' ||
      !expectedSecret ||
      expectedSecret.length === 0
    ) {
      throw new NotFoundException();
    }
    if (!secret || secret !== expectedSecret) {
      throw new NotFoundException();
    }

    const email = body?.email?.trim();
    const userId = body?.userId?.trim();
    if ((email ? 1 : 0) + (userId ? 1 : 0) !== 1) {
      throw new BadRequestException('Provide exactly one of email or userId');
    }

    const user = email
      ? await this.userService.findByEmail(email)
      : await this.userService.findByID(userId!);

    if (!user) {
      throw new NotFoundException();
    }

    return this.authService.issueSessionTokensForUser(user);
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
