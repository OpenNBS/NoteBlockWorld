import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '@server/user/entity/user.entity';
import { UserService } from '@server/user/user.service';
import { Request, Response } from 'express';
import { GithubAccessToken } from './types/githubProfile';
import { TokenPayload, Tokens } from './types/token';
import { CreateUser } from '@server/user/dto/CreateUser.dto';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async googleLogin(req: Request, res: Response) {
    const { user } = req as any;
    const { profile } = user;
    this.logger.debug(`Auth Login Data ${JSON.stringify(user)}`);
    this.logger.debug(`Auth Login Profile ${JSON.stringify(profile)}`);
    // verify if user exists
    let user_registered = await this.userService.findByEmail(user.email);

    if (!user_registered) {
      // create user
      user_registered = new User() as UserDocument;
      // add user data

      user_registered.email = user.email;
      user_registered.username = user.displayName;
      user_registered.profileImage = user.photos[0].value;

      await this.userService.create(user_registered);
    }

    return this.GenTokenRedirect(user_registered, res);
  }

  public async githubLogin(req: Request, res: Response) {
    const user = req.user as GithubAccessToken;
    const { profile } = user;
    this.logger.debug(`Auth Login Data ${JSON.stringify(user)}`);
    this.logger.debug(`Auth Login Profile ${JSON.stringify(profile)}`);
    // verify if user exists
    let user_registered = await this.userService.findByEmail(
      profile.emails[0].value,
    );

    if (!user_registered) {
      // create user
      const new_user = new CreateUser();

      // add user data
      new_user.email = profile.emails[0].value;
      new_user.username = profile.displayName;

      user_registered = await this.userService.create(new_user);
    }

    return this.GenTokenRedirect(user_registered, res);
  }
  public async auth0Login(req: Request, res: Response) {
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

    return this.GenTokenRedirect(user_registered, res);
  }
  private tokenRedirect(token: Tokens, userId: string, isNew: boolean): string {
    const url = `${
      process.env.APP_URL || 'http://localhost:4000'
    }/auth/external${token ? `?token=${token.access_token}` : ''}${
      token ? `&refresh_token=${token.refresh_token}` : ''
    }${userId ? `&user_id=${userId}` : ''}${isNew ? `&new=true` : ''}`;
    this.logger.debug(`Redirect URL ${url}`);
    return url;
  }
  private async createJwtPayload(payload: TokenPayload): Promise<Tokens> {
    const JWT_SECRET = this.configService.get('JWT_SECRET');
    const JWT_EXPIRES_IN = this.configService.get('JWT_EXPIRES_IN');
    const JWT_REFRESH_SECRET = this.configService.get('JWT_REFRESH_SECRET');
    const JWT_REFRESH_EXPIRES_IN = this.configService.get(
      'JWT_REFRESH_EXPIRES_IN',
    );
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: JWT_SECRET,
        expiresIn: JWT_EXPIRES_IN,
      }),
      this.jwtService.signAsync(payload, {
        secret: JWT_REFRESH_SECRET,
        expiresIn: JWT_REFRESH_EXPIRES_IN,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  private async GenTokenRedirect(
    user_registered: UserDocument,
    res: Response<any, Record<string, any>>,
  ): Promise<void> {
    const tokenPayload = await this.createJwtPayload({
      id: user_registered._id.toString(),
      email: user_registered.email,
      username: user_registered.username,
    });
    this.logger.debug(`User ${JSON.stringify(user_registered)}`);
    this.logger.debug(`Login User ${JSON.stringify(tokenPayload)}`);
    const url = await this.tokenRedirect(
      tokenPayload,
      user_registered.id,
      true,
    );
    return res.redirect(url);
  }
}
