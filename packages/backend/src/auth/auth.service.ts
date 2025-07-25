import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUser } from '@nbw/database';
import axios from 'axios';
import type { Request, Response } from 'express';

import type { UserDocument } from '@server/user/entity/user.entity';
import { UserService } from '@server/user/user.service';

import { DiscordUser } from './types/discordProfile';
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
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject('COOKIE_EXPIRES_IN')
    private readonly COOKIE_EXPIRES_IN: string,
    @Inject('FRONTEND_URL')
    private readonly FRONTEND_URL: string,

    @Inject('JWT_SECRET')
    private readonly JWT_SECRET: string,
    @Inject('JWT_EXPIRES_IN')
    private readonly JWT_EXPIRES_IN: string,
    @Inject('JWT_REFRESH_SECRET')
    private readonly JWT_REFRESH_SECRET: string,
    @Inject('JWT_REFRESH_EXPIRES_IN')
    private readonly JWT_REFRESH_EXPIRES_IN: string,
    @Inject('APP_DOMAIN')
    private readonly APP_DOMAIN?: string,
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

  public async discordLogin(req: Request, res: Response) {
    const user = (req.user as DiscordUser).profile;
    const profilePictureUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;

    const profile = {
      // Generate username from display name
      username: user.username,
      email: user.email,
      profileImage: profilePictureUrl,
    };

    // verify if user exists
    const user_registered = await this.verifyAndGetUser(profile);

    return this.GenTokenRedirect(user_registered, res);
  }

  public async loginWithEmail(req: Request, res: Response) {
    const user = req.user as UserDocument;

    if (!user) {
      return res.redirect(this.FRONTEND_URL + '/login');
    }

    return this.GenTokenRedirect(user, res);
  }

  public async createJwtPayload(payload: TokenPayload): Promise<Tokens> {
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
    const maxAge = parseInt(this.COOKIE_EXPIRES_IN) * 1000;

    res.cookie('token', token.access_token, {
      domain: domain,
      maxAge: maxAge,
    });

    res.cookie('refresh_token', token.refresh_token, {
      domain: domain,
      maxAge: maxAge,
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
}
