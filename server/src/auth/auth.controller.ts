import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '@shared/validation/user/dto/Login.dto';
import { RegisterDto } from '@shared/validation/user/dto/Register.dto';
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

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  public async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  public async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
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

  @Get('login/discord')
  @UseGuards(AuthGuard('discord'))
  public discordLogin() {
    // Not need for implementation, its handled by passport
    this.logger.log('Discord login');
  }

  @Get('discord/callback')
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
    // Not need for implementation, its handled by passport
    this.authService.verifyToken(req, res);
  }
}
