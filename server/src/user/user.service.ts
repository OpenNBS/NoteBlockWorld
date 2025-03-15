import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';
import { SearchQueryDTO } from '@shared/validation/common/dto/SearchQuery.dto';
import { CreateUser } from '@shared/validation/user/dto/CreateUser.dto';
import { GetUser } from '@shared/validation/user/dto/GetUser.dto';
import { UpdateUsernameDto } from '@shared/validation/user/dto/UpdateUsername.dto';
import { UpdateUserProfileDto } from '@shared/validation/user/dto/UpdateUserProfile.dto';
import { UserProfileViewDto } from '@shared/validation/user/dto/UserProfileView.dto';
import { validate } from 'class-validator';
import { Model } from 'mongoose';

import { UserDto } from './dto/user.dto';
import { User, UserDocument } from './entity/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

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

    const user = await this.userModel.create({
      email: email,
      username: emailPrefixUsername,
      publicName: emailPrefixUsername,
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

  public async findByUsername(username: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ username }).exec();

    return user;
  }

  public async getUserPaginated(query: PageQueryDTO) {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'asc' } = query;

    const queryText = query.query;

    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    const users: (UserDocument & { songCount: number })[] =
      await this.userModel.aggregate([
        {
          $match: queryText
            ? {
                username: { $regex: queryText, $options: 'i' }, // Case-insensitive regex search
              }
            : {
                _id: { $exists: true },
              }, // If no search query, match all documents
        },
        {
          $lookup: {
            from: 'songs', // The name of the songs collection
            localField: '_id', // The field from the users collection
            foreignField: 'userId', // The field from the songs collection
            as: 'songs', // The array field that will contain the joined songs
          },
        },
        {
          $addFields: {
            songCount: { $size: '$songs' }, // Add a new field with the count of songs
          },
        },
        {
          $project: {
            songs: 0, // Exclude the songs array from the final output
          },
        },
        {
          $sort: { [sort]: sortOrder },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);

    const total = await this.userModel.countDocuments(
      queryText ? { username: { $regex: queryText, $options: 'i' } } : {},
    );

    return {
      data: users,
      total,
      page,
      limit,
    };
  }

  public async search(queryBody: SearchQueryDTO) {
    const {
      query = '',
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order,
    } = queryBody;

    const skip = (page - 1) * limit;
    const sortOrder = order ? 1 : -1;

    const users: {
      username: string;
      profileImage: string;
    }[] = await this.userModel.aggregate([
      {
        $match: {
          $text: {
            $search: query,
            $caseSensitive: false,
            $diacriticSensitive: false,
          },
        },
      },
      {
        $project: {
          username: 1,
          profileImage: 1,
        },
      },
      {
        $sort: { [sort]: sortOrder },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    const totalResult = await this.userModel.aggregate([
      {
        $match: {
          $text: {
            $search: query,
            $caseSensitive: false,
            $diacriticSensitive: false,
          },
        },
      },
      {
        $count: 'total',
      },
    ]);

    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    this.logger.debug(
      `Retrived users: ${users.length} documents, with total: ${total}`,
    );

    return {
      users,
      total,
      page,
      limit,
    };
  }

  public async getUserByEmailOrId(query: GetUser) {
    const { email, id, username } = query;
    let user;

    if (email) {
      user = await this.findByEmail(email);
    } else if (id) {
      user = await this.findByID(id);
    } else if (username) {
      user = await this.findByUsername(username);
    } else {
      throw new HttpException(
        'You must provide an email, ID or username',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return UserProfileViewDto.fromUserDocument(user);
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
        HttpStatus.BAD_REQUEST,
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

  public async updateProfile(user: UserDocument, body: UpdateUserProfileDto) {
    const { description, socialLinks, username } = body;

    if (description) user.description = description;
    if (socialLinks) user.socialLinks = socialLinks;
    if (username) user.username = username;

    return await this.userModel.findOneAndUpdate({ _id: user._id }, user, {
      new: true,
    });
  }

  public async createSearchIndexes() {
    return await this.userModel.collection.createIndex(
      {
        username: 'text',
        publicName: 'text',
        description: 'text',
      },
      {
        weights: {
          username: 5,
          publicName: 3,
          description: 1,
        },
        name: 'user_search_index',
      },
    );
  }
}
