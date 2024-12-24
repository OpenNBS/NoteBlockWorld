import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UserService } from '@server/user/user.service';

@Injectable()
export class SeedService {
  public readonly logger = new Logger(SeedService.name);
  constructor(
    @Inject('NODE_ENV')
    private readonly NODE_ENV: string,

    @Inject(UserService)
    private readonly userService: UserService,
  ) {}
  public async seed() {
    if (this.NODE_ENV !== 'development') {
      this.logger.error('Seeding is only allowed in development mode');
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    throw new Error('Method not implemented.');
  }
}
