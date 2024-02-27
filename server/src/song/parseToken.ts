import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class ParseTokenPipe implements CanActivate {
  private static logger = new Logger(ParseTokenPipe.name);

  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization;

    if (!bearerToken) {
      return true;
    }
    const token = bearerToken.split(' ')[1];
    const user = await this.authService.getUserFromToken(token);
    if (!user) {
      return true;
    }
    request.existingUser = user;
    return true;
  }
}
