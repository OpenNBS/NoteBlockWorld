import { User } from '../entity/user.entity';

export class UserDto {
  username: string;
  publicName: string;
  email: string;
  static fromEntity(user: User): UserDto {
    const userDto: UserDto = {
      username: user.username,
      publicName: user.publicName,
      email: user.email,
    };

    return userDto;
  }
}
