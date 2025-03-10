import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';
import { CreateUser } from '@shared/validation/user/dto/CreateUser.dto';
import { GetUser } from '@shared/validation/user/dto/GetUser.dto';
import { Model } from 'mongoose';

import { User, UserDocument } from './entity/user.entity';
import { UserService } from './user.service';

const mockUserModel = {
  create: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  exec: jest.fn(),
  select: jest.fn(),
  countDocuments: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUser = {
        username: 'testuser',
        email: 'test@example.com',
        profileImage: 'testimage.png',
      };

      const user = {
        ...createUserDto,
        save: jest.fn().mockReturnThis(),
      } as any;

      jest.spyOn(userModel, 'create').mockReturnValue(user);

      const result = await service.create(createUserDto);

      expect(result).toEqual(user);
      expect(userModel.create).toHaveBeenCalledWith(createUserDto);
      expect(user.save).toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const user = { email } as UserDocument;

      jest.spyOn(userModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      } as any);

      const result = await service.findByEmail(email);

      expect(result).toEqual(user);
      expect(userModel.findOne).toHaveBeenCalledWith({ email });
    });
  });

  describe('findByID', () => {
    it('should find a user by ID', async () => {
      const id = 'test-id';
      const user = { _id: id } as UserDocument;

      jest.spyOn(userModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      } as any);

      const result = await service.findByID(id);

      expect(result).toEqual(user);
      expect(userModel.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('getUserPaginated', () => {
    it('should return paginated users', async () => {
      const query: PageQueryDTO = { page: 1, limit: 10 };
      const users = [{ username: 'testuser' }] as UserDocument[];

      const usersPage = {
        users,
        total: 1,
        page: 1,
        limit: 10,
      };

      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(users),
      };

      jest.spyOn(userModel, 'find').mockReturnValue(mockFind as any);
      jest.spyOn(userModel, 'countDocuments').mockResolvedValue(1);

      const result = await service.getUserPaginated(query);

      expect(result).toEqual(usersPage);
      expect(userModel.find).toHaveBeenCalledWith({});
    });
  });

  describe('getUserByEmailOrId', () => {
    it('should find a user by email', async () => {
      const query: GetUser = { email: 'test@example.com' };
      const user = { email: 'test@example.com' } as UserDocument;

      jest.spyOn(service, 'findByEmail').mockResolvedValue(user);

      const result = await service.getUserByEmailOrId(query);

      expect(result).toEqual(user);
      expect(service.findByEmail).toHaveBeenCalledWith(query.email);
    });

    it('should find a user by ID', async () => {
      const query: GetUser = { id: 'test-id' };
      const user = { _id: 'test-id' } as UserDocument;

      jest.spyOn(service, 'findByID').mockResolvedValue(user);

      const result = await service.getUserByEmailOrId(query);

      expect(result).toEqual(user);
      expect(service.findByID).toHaveBeenCalledWith(query.id);
    });

    it('should throw an error if username is provided', async () => {
      const query: GetUser = { username: 'testuser' };

      await expect(service.getUserByEmailOrId(query)).rejects.toThrow(
        new HttpException(
          'Username is not supported yet',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an error if neither email nor ID is provided', async () => {
      const query: GetUser = {};

      await expect(service.getUserByEmailOrId(query)).rejects.toThrow(
        new HttpException(
          'You must provide an email or an id',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('getHydratedUser', () => {
    it('should return a hydrated user', async () => {
      const user = { _id: 'test-id' } as UserDocument;
      const hydratedUser = { ...user, songs: [] } as unknown as UserDocument;

      jest.spyOn(userModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(hydratedUser),
      } as any);

      const result = await service.getHydratedUser(user);

      expect(result).toEqual(hydratedUser);
      expect(userModel.findById).toHaveBeenCalledWith(user._id);

      expect(userModel.findById(user._id).populate).toHaveBeenCalledWith(
        'songs',
      );
    });
  });

  describe('getSelfUserData', () => {
    it('should return self user data', async () => {
      const user = { _id: 'test-id' } as UserDocument;
      const userData = { ...user, lastSeen: new Date() } as UserDocument;

      jest.spyOn(service, 'findByID').mockResolvedValue(userData);

      const result = await service.getSelfUserData(user);

      expect(result).toEqual(userData);
      expect(service.findByID).toHaveBeenCalledWith(user._id.toString());
    });

    it('should throw an error if user is not found', async () => {
      const user = { _id: 'test-id' } as UserDocument;

      jest.spyOn(service, 'findByID').mockResolvedValue(null);

      await expect(service.getSelfUserData(user)).rejects.toThrow(
        new HttpException('user not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should update lastSeen and increment loginStreak if lastSeen is before today', async () => {
      const user = { _id: 'test-id' } as UserDocument;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const userData = {
        ...user,
        lastSeen: yesterday,
        loginStreak: 1,
        save: jest.fn().mockResolvedValue(true),
      } as unknown as UserDocument;

      jest.spyOn(service, 'findByID').mockResolvedValue(userData);

      const result = await service.getSelfUserData(user);

      expect(result.lastSeen).toBeInstanceOf(Date);
      expect(result.loginStreak).toBe(2);
      expect(userData.save).toHaveBeenCalled();
    });

    it('should not update lastSeen or increment loginStreak if lastSeen is today', async () => {
      const user = { _id: 'test-id' } as UserDocument;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const userData = {
        ...user,
        lastSeen: today,
        loginStreak: 1,
        save: jest.fn().mockResolvedValue(true),
      } as unknown as UserDocument;

      jest.spyOn(service, 'findByID').mockResolvedValue(userData);

      const result = await service.getSelfUserData(user);

      expect(result.lastSeen).toEqual(today);
      expect(result.loginStreak).toBe(1);
      expect(userData.save).not.toHaveBeenCalled();
    });

    it('should reset loginStreak if lastSeen is not yesterday', async () => {
      const user = { _id: 'test-id' } as UserDocument;
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      twoDaysAgo.setHours(0, 0, 0, 0);

      const userData = {
        ...user,
        lastSeen: twoDaysAgo,
        loginStreak: 5,
        save: jest.fn().mockResolvedValue(true),
      } as unknown as UserDocument;

      jest.spyOn(service, 'findByID').mockResolvedValue(userData);

      const result = await service.getSelfUserData(user);

      expect(result.lastSeen).toBeInstanceOf(Date);
      expect(result.loginStreak).toBe(1);
      expect(userData.save).toHaveBeenCalled();
    });

    it('should increment loginCount if lastSeen is not today', async () => {
      const user = { _id: 'test-id' } as UserDocument;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const userData = {
        ...user,
        lastSeen: yesterday,
        loginCount: 5,
        save: jest.fn().mockResolvedValue(true),
      } as unknown as UserDocument;

      jest.spyOn(service, 'findByID').mockResolvedValue(userData);

      const result = await service.getSelfUserData(user);

      expect(result.lastSeen).toBeInstanceOf(Date);
      expect(result.loginCount).toBe(6);
      expect(userData.save).toHaveBeenCalled();
    });

    it('should not increment loginCount if lastSeen is today', async () => {
      const user = { _id: 'test-id' } as UserDocument;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const userData = {
        ...user,
        lastSeen: today,
        loginCount: 5,
        save: jest.fn().mockResolvedValue(true),
      } as unknown as UserDocument;

      jest.spyOn(service, 'findByID').mockResolvedValue(userData);

      const result = await service.getSelfUserData(user);

      expect(result.lastSeen).toEqual(today);
      expect(result.loginCount).toBe(5);
      expect(userData.save).not.toHaveBeenCalled();
    });

    it('should increment maxLoginStreak if login streak exceeds max', async () => {
      const user = { _id: 'test-id' } as UserDocument;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const userData = {
        ...user,
        lastSeen: yesterday,
        loginStreak: 8,
        maxLoginStreak: 8,
        save: jest.fn().mockResolvedValue(true),
      } as unknown as UserDocument;

      jest.spyOn(service, 'findByID').mockResolvedValue(userData);

      const result = await service.getSelfUserData(user);

      expect(result.maxLoginStreak).toBe(9);
      expect(userData.save).toHaveBeenCalled();
    });

    it('should not increment maxLoginStreak if login streak is less than the max', async () => {
      const user = { _id: 'test-id' } as UserDocument;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const userData = {
        ...user,
        lastSeen: yesterday,
        loginStreak: 4,
        maxLoginStreak: 8,
        save: jest.fn().mockResolvedValue(true),
      } as unknown as UserDocument;

      jest.spyOn(service, 'findByID').mockResolvedValue(userData);

      const result = await service.getSelfUserData(user);

      expect(result.maxLoginStreak).toBe(8);
      expect(userData.save).toHaveBeenCalled();
    });
  });

  describe('usernameExists', () => {
    it('should return true if username exists', async () => {
      const username = 'testuser';
      const user = { username } as UserDocument;

      jest.spyOn(userModel, 'findOne').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(user),
      } as any);

      const result = await service.usernameExists(username);

      expect(result).toBe(true);
      expect(userModel.findOne).toHaveBeenCalledWith({ username });

      expect(userModel.findOne({ username }).select).toHaveBeenCalledWith(
        'username',
      );
    });

    it('should return false if username does not exist', async () => {
      const username = 'testuser';

      jest.spyOn(userModel, 'findOne').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const result = await service.usernameExists(username);

      expect(result).toBe(false);
      expect(userModel.findOne).toHaveBeenCalledWith({ username });

      expect(userModel.findOne({ username }).select).toHaveBeenCalledWith(
        'username',
      );
    });
  });

  describe('generateUsername', () => {
    it('should generate a unique username', async () => {
      const inputUsername = 'test user';
      const baseUsername = 'test_user';

      jest.spyOn(service, 'usernameExists').mockResolvedValueOnce(false);

      const result = await service.generateUsername(inputUsername);

      expect(result).toBe(baseUsername);
      expect(service.usernameExists).toHaveBeenCalledWith(baseUsername);
    });

    it('should generate a unique username with a number suffix if base username is taken', async () => {
      const inputUsername = 'test user';
      const baseUsername = 'test_user';

      jest
        .spyOn(service, 'usernameExists')
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      const result = await service.generateUsername(inputUsername);

      expect(result).toMatch('test_user_2');
      expect(service.usernameExists).toHaveBeenCalledWith(baseUsername);
    });
  });

  describe('normalizeUsername', () => {
    it('should normalize a username', () => {
      const inputUsername = 'tést user';
      const normalizedUsername = 'test_user';

      const result = (service as any).normalizeUsername(inputUsername);

      expect(result).toBe(normalizedUsername);
    });

    it('should remove special characters from a username', () => {
      const inputUsername = '静_かな';
      const normalizedUsername = '_';

      const result = (service as any).normalizeUsername(inputUsername);

      expect(result).toBe(normalizedUsername);
    });

    it('should replace spaces with underscores in a username', () => {
      const inputUsername = 'Имя пользователя';
      const normalizedUsername = '_';

      const result = (service as any).normalizeUsername(inputUsername);

      expect(result).toBe(normalizedUsername);
    });

    it('should replace spaces with underscores in a username', () => {
      const inputUsername = 'Eglė Čepulytė';
      const normalizedUsername = 'Egle_Cepulyte';

      const result = (service as any).normalizeUsername(inputUsername);

      expect(result).toBe(normalizedUsername);
    });
  });

  describe('updateUsername', () => {
    it('should update a user username', async () => {
      const user = {
        username: 'testuser',
        save: jest.fn().mockReturnThis(),
      } as unknown as UserDocument;

      const body = { username: 'newuser' };

      jest.spyOn(service, 'usernameExists').mockResolvedValue(false);

      const result = await service.updateUsername(user, body);

      expect(result).toEqual({
        username: 'newuser',
        publicName: undefined,
        email: undefined,
      });

      expect(user.username).toBe(body.username);
      expect(service.usernameExists).toHaveBeenCalledWith(body.username);
    });

    it('should throw an error if username already exists', async () => {
      const user = {
        username: 'testuser',
        save: jest.fn().mockReturnThis(),
      } as unknown as UserDocument;

      const body = { username: 'newuser' };

      jest.spyOn(service, 'usernameExists').mockResolvedValue(true);

      await expect(service.updateUsername(user, body)).rejects.toThrow(
        new HttpException('Username already exists', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
