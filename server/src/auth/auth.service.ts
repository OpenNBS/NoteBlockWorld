import { Inject, Injectable, Logger } from '@nestjs/common';
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
  private readonly COOKIE_EXPIRES_IN: string;
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
      COOKIE_EXPIRES_IN:
        configService.get('COOKIE_EXPIRES_IN') || String(60 * 60 * 24 * 7), // 7 days
      JWT_SECRET: this.configService.get('JWT_SECRET'),
      JWT_EXPIRES_IN: this.configService.get('JWT_EXPIRES_IN'),
      JWT_REFRESH_SECRET: this.configService.get('JWT_REFRESH_SECRET'),
      JWT_REFRESH_EXPIRES_IN: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    };

    if (Object.values(config).some((value) => value === undefined)) {
      for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
          this.logger.error(`Missing ${key} environment variable`);
        }
      }

      throw new Error('Missing environment variables');
    }

    this.FRONTEND_URL = config.FRONTEND_URL;
    this.COOKIE_EXPIRES_IN = config.COOKIE_EXPIRES_IN;
    this.JWT_SECRET = config.JWT_SECRET;
    this.JWT_EXPIRES_IN = config.JWT_EXPIRES_IN;
    this.JWT_REFRESH_SECRET = config.JWT_REFRESH_SECRET;
    this.JWT_REFRESH_EXPIRES_IN = config.JWT_REFRESH_EXPIRES_IN;
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
    const response = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `token ${user.accessToken}`,
      },
    });

    const email = (response.data as GithubEmailList).filter(
      (email) => email.primary,
    )[0].email;

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

    function createCookieString(name: string, value: string): string {
      return `${name}=${value}`;
    }

    const userId = user_registered._id.toString();
    const frontEndURL = this.FRONTEND_URL;
    const cookies = [
      createCookieString('token', token.access_token),
      createCookieString('refresh_token', token.refresh_token),
      createCookieString('user', userId),
    ];
    const url = `${frontEndURL}/auth/login-success?${cookies.join('&')}`;
    res.redirect(url);
  }

  public async getUserFromToken(token: string): Promise<UserDocument | null> {
    const decoded = this.jwtService.decode(token) as TokenPayload;

    if (!decoded) {
      return null;
    }

    const user = await this.userService.findByID(decoded.id);

    return user;
  }
}
