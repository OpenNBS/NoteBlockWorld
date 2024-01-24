import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public getSecureResource(): any {
    return {
      message: 'This is a secure resource, congrats! You are authenticated!',
    };
  }
  public getHello(): string {
    return 'Hello World!';
  }
}
