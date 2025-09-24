import type { UserDocument } from '@nbw/database';
import { GetUser, PageQueryDTO } from '@nbw/database';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from './user.controller';
import { UserService } from './user.service';

const mockUserService = {
  getUserByEmailOrId: jest.fn(),
  getUserPaginated  : jest.fn(),
  getSelfUserData   : jest.fn(),
};

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers  : [
        {
          provide : UserService,
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
    it('should return user data by email or ID', async () => {
      const query: GetUser = {
        email   : 'test@email.com',
        username: 'test-username',
        id      : 'test-id',
      };

      const user = { email: 'test@example.com' };

      mockUserService.getUserByEmailOrId.mockResolvedValueOnce(user);

      const result = await userController.getUser(query);

      expect(result).toEqual(user);
      expect(userService.getUserByEmailOrId).toHaveBeenCalledWith(query);
    });
  });

  describe('getUserPaginated', () => {
    it('should return paginated user data', async () => {
      const query: PageQueryDTO = { page: 1, limit: 10 };
      const paginatedUsers = { items: [], total: 0 };

      mockUserService.getUserPaginated.mockResolvedValueOnce(paginatedUsers);

      const result = await userController.getUserPaginated(query);

      expect(result).toEqual(paginatedUsers);
      expect(userService.getUserPaginated).toHaveBeenCalledWith(query);
    });
  });

  describe('getMe', () => {
    it('should return the token owner data', async () => {
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const userData = { _id: 'test-user-id', email: 'test@example.com' };

      mockUserService.getSelfUserData.mockResolvedValueOnce(userData);

      const result = await userController.getMe(user);

      expect(result).toEqual(userData);
      expect(userService.getSelfUserData).toHaveBeenCalledWith(user);
    });

    it('should handle null user', async () => {
      const user = null;

      await expect(userController.getMe(user)).rejects.toThrow(HttpException);
    });
  });
});
