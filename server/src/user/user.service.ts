import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './entity/user.entity';

@Injectable()
export class UserService {
  public create(user_registered: UserDocument) {
    throw new Error('Method not implemented.');
  }
  public findByEmail(email: string): UserDocument {
    throw new Error('Method not implemented.');
  }
}
