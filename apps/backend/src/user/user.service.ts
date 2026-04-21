import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '@nbw/database';
import {
  type CreateUser,
  createUserSchema,
  pageQueryDTOSchema,
  type PageQueryInput,
} from '@nbw/validation';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async create(user_registered: CreateUser) {
    createUserSchema.parse(user_registered);
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
      if (error instanceof Error) {
        throw error;
      }

      throw new Error(String(error));
    }
  }

  public async createWithEmail(email: string): Promise<UserDocument> {
    // verify if user exists same email, username or publicName
    const userByEmail = await this.findByEmail(email);

    if (userByEmail) {
      throw new HttpException(
        'Email already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const emailPrefixUsername = await this.generateUsername(
      email.split('@')[0],
    );

    return await this.userModel.create({
      email: email,
      username: emailPrefixUsername,
      publicName: emailPrefixUsername,
    });
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  public async findByID(objectID: string): Promise<UserDocument | null> {
    return await this.userModel.findById(objectID).exec();
  }

  public async findByPublicName(
    publicName: string,
  ): Promise<UserDocument | null> {
    return await this.userModel.findOne({ publicName });
  }

  public async findByUsername(username: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ username });
  }

  public async getUserPaginated(query: PageQueryInput) {
    const q = pageQueryDTOSchema.parse(query);
    const page = q.page;
    const limit = q.limit ?? 10;
    const sort = q.sort;
    const normalizedOrder = q.order === 'asc';

    const skip = (page - 1) * limit;
    const sortOrder = normalizedOrder ? 1 : -1;

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

  public async getHydratedUser(user: UserDocument) {
    return await this.userModel.findById(user._id).populate('songs').exec();
  }

  public async usernameExists(username: string) {
    const user = await this.userModel
      .findOne({ username })
      .select('username')
      .exec();

    return !!user;
  }

  public normalizeUsername = (inputUsername: string) =>
    inputUsername
      .replace(' ', '_')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_]/g, '');

  public async generateUsername(inputUsername: string) {
    // Normalize username (remove accents, replace spaces with underscores)
    const baseUsername = this.normalizeUsername(inputUsername);

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
