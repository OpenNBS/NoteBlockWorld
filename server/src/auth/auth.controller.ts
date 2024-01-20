import { Controller, Get, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Get('signIn')
  @ApiResponse({
    status: 200,
    description: 'Returns an OAuth Login Url to be used by the user',
  })
  @ApiOperation({
    description: 'Authorize a client to access user data',
    summary: 'Authorize',
    tags: ['OAuth Authorize'],
  })
  public async login(): Promise<any> {
    return await this.authService.signIn();
  }
}
