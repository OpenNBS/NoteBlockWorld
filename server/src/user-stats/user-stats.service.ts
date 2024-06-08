import { Injectable, Logger } from '@nestjs/common';

import { UserDocument } from '../user/entity/user.entity';

@Injectable()
export class UserStatsService {
  private static logger = new Logger(UserStatsService.name);

  public async updateUserLastLogin(user: UserDocument): Promise<void> {
    UserStatsService.logger.log(
      `Updating last login for user ${user._id.toString()}`,
    );

    user.lastLogin = new Date();
    await user.save();
  }

  public async updateUserLoginStreak(user: UserDocument): Promise<void> {
    UserStatsService.logger.log(
      `Updating login streak for user ${user._id.toString()}`,
    );

    user.loginStreak += 1;
    await user.save();
  }
}
