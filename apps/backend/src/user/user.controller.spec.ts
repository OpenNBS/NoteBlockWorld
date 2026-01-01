import type { UserDocument } from '@nbw/database';
import {
  GetUser,
  PageQueryDTO,
  UpdateUsernameDto,
  UserDto,
} from '@nbw/database';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from './user.controller';
import { UserService } from './user.service';

const mockUserService = {
  findByEmail: jest.fn(),
  findByID: jest.fn(),
  getUserPaginated: jest.fn(),
  normalizeUsername: jest.fn(),
  usernameExists: jest.fn(),
};

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getUser', () => {
    it('should return user data by email', async () => {
      const query: GetUser = {
        email: 'test@email.com',
      };

      const user = { email: 'test@email.com' };

      mockUserService.findByEmail.mockResolvedValueOnce(user);

      const result = await userController.getUser(query);

      expect(result).toEqual(user);
      expect(userService.findByEmail).toHaveBeenCalledWith(query.email);
    });

    it('should return user data by ID', async () => {
      const query: GetUser = {
        id: 'test-id',
      };

      const user = { _id: 'test-id' };

      mockUserService.findByID.mockResolvedValueOnce(user);

      const result = await userController.getUser(query);

      expect(result).toEqual(user);
      expect(userService.findByID).toHaveBeenCalledWith(query.id);
    });

    it('should throw an error if username is provided', async () => {
      const query: GetUser = {
        username: 'test-username',
      };

      await expect(userController.getUser(query)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if neither email nor ID is provided', async () => {
      const query: GetUser = {};

      await expect(userController.getUser(query)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getUserPaginated', () => {
    it('should return paginated user data', async () => {
      const query: PageQueryDTO = { page: 1, limit: 10 };
      const paginatedUsers = { users: [], total: 0, page: 1, limit: 10 };

      mockUserService.getUserPaginated.mockResolvedValueOnce(paginatedUsers);

      const result = await userController.getUserPaginated(query);

      expect(result).toEqual(paginatedUsers);
      expect(userService.getUserPaginated).toHaveBeenCalledWith(query);
    });
  });

  describe('getMe', () => {
    it('should return the token owner data', async () => {
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const userData = {
        _id: 'test-user-id',
        email: 'test@example.com',
        lastSeen: new Date(),
        loginStreak: 1,
        maxLoginStreak: 1,
        loginCount: 1,
        save: jest.fn().mockResolvedValue(true),
      } as unknown as UserDocument;

      mockUserService.findByID.mockResolvedValueOnce(userData);

      const result = await userController.getMe(user);

      expect(result).toEqual(userData);
      expect(userService.findByID).toHaveBeenCalledWith(user._id.toString());
    });

    it('should handle null user', async () => {
      const user = null;

      await expect(userController.getMe(user)).rejects.toThrow(HttpException);
    });

    it('should throw an error if user is not found', async () => {
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      mockUserService.findByID.mockResolvedValueOnce(null);

      await expect(userController.getMe(user)).rejects.toThrow(HttpException);
    });

    it('should update lastSeen and increment loginStreak if lastSeen is before today', async () => {
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const userData = {
        _id: 'test-user-id',
        lastSeen: yesterday,
        loginStreak: 1,
        maxLoginStreak: 1,
        loginCount: 1,
        save: jest.fn().mockResolvedValue(true),
      } as unknown as UserDocument;

      mockUserService.findByID.mockResolvedValueOnce(userData);

      const result = await userController.getMe(user);

      expect(result.lastSeen).toBeInstanceOf(Date);
      expect(result.loginStreak).toBe(2);
      expect(result.loginCount).toBe(2);
      expect(userData.save).toHaveBeenCalled();
    });

    it('should not update lastSeen or increment loginStreak if lastSeen is today', async () => {
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const userData = {
        _id: 'test-user-id',
        lastSeen: today,
        loginStreak: 1,
        maxLoginStreak: 1,
        loginCount: 1,
        save: jest.fn().mockResolvedValue(true),
      } as unknown as UserDocument;

      mockUserService.findByID.mockResolvedValueOnce(userData);

      const result = await userController.getMe(user);

      expect(result.lastSeen).toEqual(today);
      expect(result.loginStreak).toBe(1);
      expect(result.loginCount).toBe(1);
      expect(userData.save).not.toHaveBeenCalled();
    });

    it('should reset loginStreak if lastSeen is not yesterday', async () => {
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      twoDaysAgo.setHours(0, 0, 0, 0);

      const userData = {
        _id: 'test-user-id',
        lastSeen: twoDaysAgo,
        loginStreak: 5,
        maxLoginStreak: 5,
        loginCount: 1,
        save: jest.fn().mockResolvedValue(true),
      } as unknown as UserDocument;

      mockUserService.findByID.mockResolvedValueOnce(userData);

      const result = await userController.getMe(user);

      expect(result.lastSeen).toBeInstanceOf(Date);
      expect(result.loginStreak).toBe(1);
      expect(userData.save).toHaveBeenCalled();
    });

    it('should increment maxLoginStreak if login streak exceeds max', async () => {
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const userData = {
        _id: 'test-user-id',
        lastSeen: yesterday,
        loginStreak: 8,
        maxLoginStreak: 8,
        loginCount: 1,
        save: jest.fn().mockResolvedValue(true),
      } as unknown as UserDocument;

      mockUserService.findByID.mockResolvedValueOnce(userData);

      const result = await userController.getMe(user);

      expect(result.maxLoginStreak).toBe(9);
      expect(userData.save).toHaveBeenCalled();
    });
  });

  describe('updateUsername', () => {
    it('should update the username', async () => {
      const user: UserDocument = {
        _id: 'test-user-id',
        username: 'olduser',
        save: jest.fn().mockResolvedValue(true),
      } as unknown as UserDocument;
      const body: UpdateUsernameDto = { username: 'newuser' };
      const normalizedUsername = 'newuser';

      mockUserService.normalizeUsername.mockReturnValue(normalizedUsername);
      mockUserService.usernameExists.mockResolvedValue(false);

      // Mock UserDto.fromEntity
      jest.spyOn(UserDto, 'fromEntity').mockReturnValue({
        username: normalizedUsername,
        publicName: user.publicName,
        email: user.email,
      });

      const result = await userController.updateUsername(user, body);

      expect(user.username).toBe(normalizedUsername);
      expect(user.lastEdited).toBeInstanceOf(Date);
      expect(user.save).toHaveBeenCalled();
      expect(userService.normalizeUsername).toHaveBeenCalledWith(body.username);
      expect(userService.usernameExists).toHaveBeenCalledWith(
        normalizedUsername,
      );
      expect(result.username).toBe(normalizedUsername);
    });

    it('should throw an error if username already exists', async () => {
      const user: UserDocument = {
        _id: 'test-user-id',
        username: 'olduser',
      } as unknown as UserDocument;
      const body: UpdateUsernameDto = { username: 'existinguser' };
      const normalizedUsername = 'existinguser';

      mockUserService.normalizeUsername.mockReturnValue(normalizedUsername);
      mockUserService.usernameExists.mockResolvedValue(true);

      await expect(userController.updateUsername(user, body)).rejects.toThrow(
        HttpException,
      );
      expect(userService.usernameExists).toHaveBeenCalledWith(
        normalizedUsername,
      );
    });

    it('should throw an error if username is the same', async () => {
      const user: UserDocument = {
        _id: 'test-user-id',
        username: 'sameuser',
      } as unknown as UserDocument;
      const body: UpdateUsernameDto = { username: 'sameuser' };
      const normalizedUsername = 'sameuser';

      mockUserService.normalizeUsername.mockReturnValue(normalizedUsername);
      mockUserService.usernameExists.mockResolvedValue(false);

      await expect(userController.updateUsername(user, body)).rejects.toThrow(
        HttpException,
      );
    });

    it('should handle null user', async () => {
      const user = null;
      const body: UpdateUsernameDto = { username: 'newuser' };

      await expect(userController.updateUsername(user, body)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
