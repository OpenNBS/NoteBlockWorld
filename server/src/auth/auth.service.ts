import { Injectable, Logger } from '@nestjs/common';
import { User, UserDocument } from '@server/user/entity/user.entity';
import { UserService } from '@server/user/user.service';
import { Request, Response } from 'express';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly userService: UserService) {}
  async auth0Login(req: Request, res: Response) {
    const { user } = req as any;
    const { profile } = user;
    this.logger.debug(`Auth Login Data ${JSON.stringify(user)}`);
    this.logger.debug(`Auth Login Profile ${JSON.stringify(profile)}`);
    // verify if user exists
    let user_registered = await this.userService.findByEmail(user.email);

    if (!user_registered) {
      // create user
      user_registered = new User() as UserDocument;
      //TODO: add user data

      await this.userService.create(user_registered);
    }

    const tokenPayload = this.createJwtPayload({
      id: user_registered.id,
      email: user_registered.email,
    });
    this.logger.debug(`User ${JSON.stringify(user_registered)}`);
    this.logger.debug(`Login User ${JSON.stringify(tokenPayload)}`);
    const url = this.tokenRedirect(tokenPayload, user_registered.id, true);
    return res.redirect(url);
  }
  private tokenRedirect(tokenPayload: void, id: any, arg2: boolean): string {
    throw new Error('Method not implemented.');
  }
  private createJwtPayload(payload: { id: any; email: any }): any {
    throw new Error('Method not implemented.');
  }
  public signIn() {
    throw new Error('Method not implemented.');
  }
}
