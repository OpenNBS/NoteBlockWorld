import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entity/user.entity';
import { CreateUser } from './dto/CreateUser.dto';
import { validate } from 'class-validator';
import { PageQuery } from '@server/common/dto/PageQuery.dto';
import { GetUser } from './dto/GetUser.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async create(user_registered: CreateUser) {
    await validate(user_registered);
    const user = new this.userModel(user_registered);
    user.username = user_registered.username;
    user.email = user_registered.email;
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
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
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
}
