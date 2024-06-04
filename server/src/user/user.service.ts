import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUser } from '@shared/validation/user/dto/CreateUser.dto';
import { GetUser } from '@shared/validation/user/dto/GetUser.dto';
import { validate } from 'class-validator';
import { Model } from 'mongoose';

import { PageQuery } from '@server/common/dto/PageQuery.dto';

import { User, UserDocument } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async create(user_registered: CreateUser) {
    await validate(user_registered);
    const user = new this.userModel(user_registered);
    user.username = user_registered.username;
    user.email = user_registered.email;
    user.profileImage = user_registered.profileImage;
    return await user.save();
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }

  public async findByID(objectID: string): Promise<UserDocument | null> {
    const user = await this.userModel.findById(objectID).exec();
    return user;
  }

  public getUserPaginated(query: PageQuery) {
    const { page, limit } = query;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const options = {
      page: page || 1,
      limit: limit || 10,
    };
    return this.userModel.find({});
  }

  public async getUserByEmailOrId(query: GetUser) {
    const { email, id, username } = query;
    if (email) {
      return await this.findByEmail(email);
    }
    if (id) {
      return await this.findByID(id);
    }
    if (username) {
      throw new HttpException(
        'Username is not supported yet',
        HttpStatus.BAD_REQUEST,
      );
    }
    throw new HttpException(
      'You must provide an email or an id',
      HttpStatus.BAD_REQUEST,
    );
  }

  public async getHydratedUser(user: UserDocument) {
    const hydratedUser = await this.userModel
      .findById(user._id)
      .populate('songs')
      .exec();
    return hydratedUser;
  }

  public async getSelfUserData(user: UserDocument | null) {
    if (!user)
      throw new HttpException('not logged in', HttpStatus.UNAUTHORIZED);
    const usedData = await this.findByID(user._id.toString());
    if (!usedData)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    return usedData;
  }

  public async usernameExists(username: string) {
    const user = await this.userModel
      .findOne({ username })
      .select('username')
      .exec();
    return !!user;
  }

  public async generateUsername(inputUsername: string) {
    // Normalize username (remove accents, lowercase, replace spaces with underscores)
    const baseUsername = inputUsername
      .toLowerCase()
      .replace(' ', '_')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_]/g, '');
    // Find if there's already a user with the same username
    let nameTaken = await this.usernameExists(baseUsername);
    while (nameTaken) {
      const newUsername = `${baseUsername}.${Math.floor(Math.random() * 100)}`;
      nameTaken = await this.usernameExists(newUsername);
    }
    return baseUsername;
  }
}
