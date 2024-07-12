import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUser } from '@shared/validation/user/dto/CreateUser.dto';
import axios from 'axios';
import type { Request, Response } from 'express';

import { UserDocument } from '@server/user/entity/user.entity';
import { UserService } from '@server/user/user.service';

import { GithubAccessToken, GithubEmailList } from './types/githubProfile';
import { GoogleProfile } from './types/googleProfile';
import { Profile } from './types/profile';
import { TokenPayload, Tokens } from './types/token';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly FRONTEND_URL: string;
  private readonly APP_DOMAIN?: string;
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;
  private readonly JWT_REFRESH_SECRET: string;
  private readonly JWT_REFRESH_EXPIRES_IN: string;
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const config = {
      FRONTEND_URL: configService.get('FRONTEND_URL'),
      APP_DOMAIN:
        configService.get('APP_DOMAIN').length > 0
          ? configService.get('APP_DOMAIN')
          : undefined,
      JWT_SECRET: this.configService.get('JWT_SECRET'),
      JWT_EXPIRES_IN: this.configService.get('JWT_EXPIRES_IN'),
      JWT_REFRESH_SECRET: this.configService.get('JWT_REFRESH_SECRET'),
      JWT_REFRESH_EXPIRES_IN: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    };

    this.FRONTEND_URL = config.FRONTEND_URL;
    this.APP_DOMAIN = config.APP_DOMAIN;
    this.JWT_SECRET = config.JWT_SECRET;
    this.JWT_EXPIRES_IN = config.JWT_EXPIRES_IN;
    this.JWT_REFRESH_SECRET = config.JWT_REFRESH_SECRET;
    this.JWT_REFRESH_EXPIRES_IN = config.JWT_REFRESH_EXPIRES_IN;
  }

  private getMaxAge(time: string): number {
    type TimeUnit = 's' | 'm' | 'h' | 'd' | 'w' | 'y';
    const times: TimeUnit[] = ['s', 'm', 'h', 'd', 'w', 'y'];

    const quantities: Record<TimeUnit, number> = {
      s: 1000,
      m: 1000 * 60,
      h: 1000 * 60 * 60,
      d: 1000 * 60 * 60 * 24,
      w: 1000 * 60 * 60 * 24 * 7,
      y: 1000 * 60 * 60 * 24 * 365,
    };

    const unit = time.charAt(time.length - 1) as TimeUnit;

    if (!times.includes(unit)) {
      throw new Error('Invalid unit');
    }

    const amount = parseInt(time.slice(0, -1));

    if (isNaN(amount)) {
      throw new Error('Invalid amount');
    }

    return amount * quantities[unit];
  }

  public async verifyToken(req: Request, res: Response) {
    const headers = req.headers;
    const authorizationHeader = headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({ message: 'No authorization header' });
    }

    const token = authorizationHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.JWT_SECRET,
      });

      // verify if user exists
      const user_registered = await this.userService.findByID(decoded.id);

      if (!user_registered) {
        return res.status(401).json({ message: 'Unauthorized' });
      } else {
        return decoded;
      }
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }

  public async googleLogin(req: Request, res: Response) {
    const user = req.user as GoogleProfile;
    const email = user.emails[0].value;

    const profile = {
      // Generate username from display name
      username: email.split('@')[0],
      email: email,
      profileImage: user.photos[0].value,
    };

    // verify if user exists
    const user_registered = await this.verifyAndGetUser(profile);

    return this.GenTokenRedirect(user_registered, res);
  }

  private async createNewUser(user: Profile) {
    const { username, email, profileImage } = user;
    const baseUsername = username;
    const newUsername = await this.userService.generateUsername(baseUsername);

    const newUser = new CreateUser({
      username: newUsername,
      email: email,
      profileImage: profileImage,
    });

    return await this.userService.create(newUser);
  }

  private async verifyAndGetUser(user: Profile) {
    const user_registered = await this.userService.findByEmail(user.email);

    if (!user_registered) {
      return await this.createNewUser(user);
    }

    // Update profile picture if it has changed
    if (user_registered.profileImage !== user.profileImage) {
      user_registered.profileImage = user.profileImage;
      await user_registered.save();
    }

    return user_registered;
  }

  public async githubLogin(req: Request, res: Response) {
    const user = req.user as GithubAccessToken;
    const { profile } = user;

    // verify if user exists
    const response = await axios.get<GithubEmailList>(
      'https://api.github.com/user/emails',
      {
        headers: {
          Authorization: `token ${user.accessToken}`,
        },
      },
    );

    const email = response.data.filter((email) => email.primary)[0].email;

    const user_registered = await this.verifyAndGetUser({
      username: profile.username,
      email: email,
      profileImage: profile.photos[0].value,
    });

    return this.GenTokenRedirect(user_registered, res);
  }

  private async createJwtPayload(payload: TokenPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.JWT_SECRET,
        expiresIn: this.JWT_EXPIRES_IN,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.JWT_REFRESH_SECRET,
        expiresIn: this.JWT_REFRESH_EXPIRES_IN,
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
    const token = await this.createJwtPayload({
      id: user_registered._id.toString(),
      email: user_registered.email,
      username: user_registered.username,
    });

    const frontEndURL = this.FRONTEND_URL;
    const domain = this.APP_DOMAIN;
    const accessTokenMaxAge = this.getMaxAge(this.JWT_EXPIRES_IN);

    const refreshTokenMaxAge = this.getMaxAge(this.JWT_REFRESH_EXPIRES_IN);

    this.logger.debug(
      `User ${user_registered.username} (${user_registered.email}) logged in`,
    );

    this.logger.debug(
      `Access token: ${token.access_token} , Refresh token: ${token.refresh_token}`,
    );

    this.logger.debug(
      `Access token max age: ${accessTokenMaxAge} , Refresh token max age: ${refreshTokenMaxAge}`,
    );

    this.logger.debug(`Frontend URL: ${frontEndURL} , Domain: ${domain}`);

    res.cookie('token', token.access_token, {
      domain: domain,
      maxAge: accessTokenMaxAge,
    });

    res.cookie('refresh_token', token.refresh_token, {
      domain: domain,
      maxAge: refreshTokenMaxAge,
    });

    res.redirect(frontEndURL + '/');
  }

  public async getUserFromToken(token: string): Promise<UserDocument | null> {
    const decoded = this.jwtService.decode(token) as TokenPayload;

    if (!decoded) {
      return null;
    }

    const user = await this.userService.findByID(decoded.id);

    return user;
  }

  public async refreshToken(req: Request, res: Response) {
    const refreshToken = req.headers.authorization?.split(' ')[1];

    if (!refreshToken) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'No refresh token provided' });
    }

    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.JWT_REFRESH_SECRET,
      });

      const user = await this.userService.findByID(decoded.id);

      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
      }

      const token = await this.createJwtPayload({
        id: user._id.toString(),
        email: user.email,
        username: user.username,
      });

      const domain = this.APP_DOMAIN;

      res.cookie('token', token.access_token, {
        domain: domain,
        maxAge: this.getMaxAge(this.JWT_EXPIRES_IN),
      });

      res.cookie('refresh_token', token.refresh_token, {
        domain: domain,
        maxAge: this.getMaxAge(this.JWT_REFRESH_EXPIRES_IN),
      });

      this.logger.debug(
        `User ${user.username} (${user.email}) refreshed token`,
      );

      return res.status(HttpStatus.OK).json({
        refresh_token: token.refresh_token,
        token: token.access_token,
      });
    } catch (error) {
      this.logger.debug(error);
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
