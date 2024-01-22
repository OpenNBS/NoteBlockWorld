import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Get('login/auth0')
  @UseGuards(AuthGuard('auth0'))
  public auth0Login() {
    this.logger.log('Auth0 login');
  }

  @Get('auth0/callback')
  @UseGuards(AuthGuard('auth0'))
  public auth0Redirect(@Req() req: Request, @Res() res: Response) {
    return this.authService.auth0Login(req, res);
  }
}
