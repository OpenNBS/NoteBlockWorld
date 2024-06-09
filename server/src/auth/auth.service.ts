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

  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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
        secret: this.configService.get('JWT_SECRET'),
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
    const token = await this.createJwtPayload({
      id: user_registered._id.toString(),
      email: user_registered.email,
      username: user_registered.username,
    });

    const userId = user_registered._id.toString();
    // set the cookie in the response
    const frontEndURL = process.env.FRONTEND_URL || 'http://localhost:3000';

    const cookie = `token=${token.access_token}; Path=/; Max-Age=${process.env.COOKIE_EXPIRES_IN}; SameSite=Lax;`;
    const cookie_refresh = `refresh_token=${token.refresh_token};  Path=/; Max-Age=${process.env.COOKIE_EXPIRES_IN}; SameSite=Lax;`;
    const cookie_user = `user=${userId}; Path=/; Max-Age=${process.env.COOKIE_EXPIRES_IN}; SameSite=Lax;`;
    res.setHeader('Set-Cookie', [cookie, cookie_refresh, cookie_user]);
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
}
