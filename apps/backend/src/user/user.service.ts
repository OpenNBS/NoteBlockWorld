import {
  CreateUser,
  GetUser,
  PageQueryDTO,
  UpdateUsernameDto,
  User,
  UserDocument,
  UserDto
} from '@nbw/database';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { validate } from 'class-validator';
import { Model } from 'mongoose';

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
        new: true // return the updated document
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
        HttpStatus.BAD_REQUEST
      );
    }

    const emailPrefixUsername = await this.generateUsername(
      email.split('@')[0]
    );

    const user = await this.userModel.create({
      email     : email,
      username  : emailPrefixUsername,
      publicName: emailPrefixUsername
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
    publicName: string
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
      limit
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
        HttpStatus.BAD_REQUEST
      );
    }

    throw new HttpException(
      'You must provide an email or an id',
      HttpStatus.BAD_REQUEST
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
    const userData = await this.findByID(user._id.toString());
    if (!userData)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to the start of the day

    const lastSeenDate = new Date(userData.lastSeen);
    lastSeenDate.setHours(0, 0, 0, 0); // Set the time to the start of the day

    if (lastSeenDate < today) {
      userData.lastSeen = new Date();

      // if the last seen date is not yesterday, reset the login streak
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (lastSeenDate < yesterday) userData.loginStreak = 1;
      else {
        userData.loginStreak += 1;
        if (userData.loginStreak > userData.maxLoginStreak)
          userData.maxLoginStreak = userData.loginStreak;
      }

      userData.loginCount++;

      userData.save(); // no need to await this, we already have the data to send back
    } // if equal or greater, do nothing about the login streak

    return userData;
  }

  public async usernameExists(username: string) {
    const user = await this.userModel
      .findOne({ username })
      .select('username')
      .exec();

    return !!user;
  }

  private normalizeUsername = (inputUsername: string) =>
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

  public async updateUsername(user: UserDocument, body: UpdateUsernameDto) {
    let { username } = body;
    username = this.normalizeUsername(username);

    if (await this.usernameExists(username)) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST
      );
    }

    if (user.username === username) {
      throw new HttpException('Username is the same', HttpStatus.BAD_REQUEST);
    }

    user.username = username;
    user.lastEdited = new Date();

    await user.save();

    return UserDto.fromEntity(user);
  }
}
