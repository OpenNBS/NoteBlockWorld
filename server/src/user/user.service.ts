import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';
import { CreateUser } from '@shared/validation/user/dto/CreateUser.dto';
import { GetUser } from '@shared/validation/user/dto/GetUser.dto';
import { NewEmailUserDto } from '@shared/validation/user/dto/NewEmailUser.dto';
import { validate } from 'class-validator';
import { Model } from 'mongoose';

import { User, UserDocument } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async create(user_registered: CreateUser) {
    await validate(user_registered);
    const user = await this.userModel.create(user_registered);
    user.username = user_registered.username;
    user.email = user_registered.email;
    user.profileImage = user_registered.profileImage;

    return await user.save();
  }

  public async update(user: UserDocument): Promise<UserDocument> {
    try {
      return (await this.userModel.findByIdAndUpdate(user._id, user, {
        new: true, // return the updated document
      })) as UserDocument;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async createWithEmail(
    registerDto: NewEmailUserDto,
  ): Promise<UserDocument> {
    // verify if user exists same email, username or publicName
    const user_registered = await this.findByEmail(registerDto.email);

    const username_registered = await this.findByUsername(registerDto.username);

    if (user_registered) {
      throw new HttpException(
        'Email already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (username_registered) {
      throw new HttpException(
        'Username already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userModel.create({
      email: registerDto.email,
      username: registerDto.username,
      publicName: registerDto.username,
    });

    return user;
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email }).exec();

    return user;
  }

  public async findByID(objectID: string): Promise<UserDocument | null> {
    const user = await this.userModel.findById(objectID).exec();

    return user;
  }

  public async findByPublicName(
    publicName: string,
  ): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ publicName });

    return user;
  }

  public async findByUsername(username: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ username });

    return user;
  }

  public async getUserPaginated(query: PageQueryDTO) {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'asc' } = query;

    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    const users = await this.userModel
      .find({})
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await this.userModel.countDocuments();

    return {
      users,
      total,
      page,
      limit,
    };
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

  public async getSelfUserData(user: UserDocument) {
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
    // Normalize username (remove accents, replace spaces with underscores)
    const baseUsername = inputUsername
      .replace(' ', '_')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_]/g, '');

    let newUsername = baseUsername;
    let counter = 1;

    // Check if the base username already exists
    while (await this.usernameExists(newUsername)) {
      newUsername = `${baseUsername}_${counter}`;
      counter++;
    }

    return newUsername;
  }
}
