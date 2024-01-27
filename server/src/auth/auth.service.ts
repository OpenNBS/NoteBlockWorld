import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '@server/user/entity/user.entity';
import { UserService } from '@server/user/user.service';
import e, { Request, Response } from 'express';
import { GithubAccessToken, GithubEmailList } from './types/githubProfile';
import { TokenPayload, Tokens } from './types/token';
import { CreateUser } from '@server/user/dto/CreateUser.dto';
import axios from 'axios';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public verifyToken(req: Request, res: Response) {
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
      return decoded;
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }

  public async googleLogin(req: Request, res: Response) {
    const { user } = req as any;
    const { profile } = user;
    this.logger.debug(`Auth Login Data ${JSON.stringify(user)}`);
    this.logger.debug(`Auth Login Profile ${JSON.stringify(profile)}`);
    // verify if user exists
    const user_registered = await this.VerifyAndGetUser(user);
    return this.GenTokenRedirect(user_registered, res);
  }

  private async VerifyAndGetUser({
    username,
    email,
  }: {
    username: string;
    email: string;
  }) {
    let user_registered = await this.userService.findByEmail(email);
    if (!user_registered) {
      // create user
      const newUser = new CreateUser({
        username: username,
        email: email,
      });
      user_registered = await this.userService.create(newUser);
    }
    return user_registered;
  }

  public async githubLogin(req: Request, res: Response) {
    const user = req.user as GithubAccessToken;
    const { profile } = user;
    console.log(`Auth Login Data ${JSON.stringify(user)}`);
    // verify if user exists
    const response = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `token ${user.accessToken}`,
      },
    });
    const email = (response.data as GithubEmailList).filter(
      (email) => email.primary,
    )[0].email;

    const user_registered = await this.VerifyAndGetUser({
      username: profile.username,
      email: email,
    });
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

    const cookie = `token=${token.access_token}; HttpOnly; Path=/; Max-Age=${process.env.COOKIE_EXPIRES_IN}; SameSite=None; Secure`;
    const cookie_refresh = `refresh_token=${token.refresh_token}; HttpOnly; Path=/; Max-Age=${process.env.COOKIE_EXPIRES_IN}; SameSite=None; Secure`;
    const cookie_user = `user=${userId}; HttpOnly; Path=/; Max-Age=${process.env.COOKIE_EXPIRES_IN}; SameSite=None; Secure`;
    res.setHeader('Set-Cookie', [cookie, cookie_refresh, cookie_user]);
    res.redirect(frontEndURL + '/browse');
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
