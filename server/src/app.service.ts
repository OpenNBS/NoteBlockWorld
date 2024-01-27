import { Injectable } from '@nestjs/common';
import { User } from './user/entity/user.entity';

@Injectable()
export class AppService {
  public getSecureResource(user: User): any {
    return {
      message: 'This is a secure resource, congrats! You are authenticated!',
      user: user,
    };
  }
  public getHello(): string {
    return 'Hello World!';
  }
}
