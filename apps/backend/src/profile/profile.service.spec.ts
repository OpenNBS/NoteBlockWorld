import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';

import { Profile, type UserDocument } from '@nbw/database';
import type { PatchProfileBody } from '@nbw/validation';
import { UserService } from '@server/user/user.service';

import {
  mergeSocialLinks,
  ProfileService,
  sanitizeSocialLinksForPublic,
  toPublicProfileDto,
} from './profile.service';

describe('ProfileService helpers', () => {
  it('sanitizeSocialLinksForPublic removes Mongo _id and keeps only known string URLs', () => {
    expect(
      sanitizeSocialLinksForPublic({
        _id: '67cf5fd96a6e68a6aa291d2a',
        github: 'https://github.com/x',
        discord: '',
      } as Record<string, unknown>),
    ).toEqual({ github: 'https://github.com/x' });
  });

  it('mergeSocialLinks overlays profile keys onto user', () => {
    expect(
      mergeSocialLinks(
        { github: 'https://a.com', x: 'https://x.com/u' },
        { github: 'https://b.com' },
      ),
    ).toEqual({ github: 'https://b.com', x: 'https://x.com/u' });
  });

  it('toPublicProfileDto uses User when Profile is null', () => {
    const user = {
      _id: new mongoose.Types.ObjectId(),
      username: 'u',
      publicName: 'U',
      profileImage: '/img.png',
      description: 'from user',
      socialLinks: { github: 'https://gh' },
    } as unknown as UserDocument;

    const dto = toPublicProfileDto(user, null);
    expect(dto.description).toBe('from user');
    expect(dto.socialLinks.github).toBe('https://gh');
  });

  it('toPublicProfileDto prefers Profile description when document exists', () => {
    const user = {
      _id: new mongoose.Types.ObjectId(),
      username: 'u',
      publicName: 'U',
      profileImage: '/img.png',
      description: 'from user',
      socialLinks: { github: 'https://user-gh' },
    } as unknown as UserDocument;

    const profile = {
      description: 'from profile',
      socialLinks: { x: 'https://x.com' },
    } as any;

    const dto = toPublicProfileDto(user, profile);
    expect(dto.description).toBe('from profile');
    expect(dto.socialLinks).toEqual({
      github: 'https://user-gh',
      x: 'https://x.com',
    });
  });
});

describe('ProfileService', () => {
  let service: ProfileService;
  const mockUserService = {
    findByID: jest.fn(),
    findByUsername: jest.fn(),
    normalizeUsername: jest.fn((s: string) => s),
    update: jest.fn(),
  };

  const mockProfileModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getModelToken(Profile.name),
          useValue: mockProfileModel,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get(ProfileService);
  });

  it('getMergedPublicProfile throws when user missing', async () => {
    mockUserService.findByID.mockResolvedValue(null);
    await expect(
      service.getMergedPublicProfile(new mongoose.Types.ObjectId().toString()),
    ).rejects.toThrow('User not found');
  });

  it('getMergedPublicProfile returns merged dto', async () => {
    const id = new mongoose.Types.ObjectId();
    mockUserService.findByID.mockResolvedValue({
      _id: id,
      username: 'a',
      publicName: 'A',
      profileImage: '/p.jpg',
      description: 'bio',
      socialLinks: {},
    });
    mockProfileModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const dto = await service.getMergedPublicProfile(id.toString());
    expect(dto.username).toBe('a');
    expect(dto.id).toBe(id.toString());
  });

  it('getMergedPublicProfileByUsername normalizes and loads by username', async () => {
    const id = new mongoose.Types.ObjectId();
    const userDoc = {
      _id: id,
      username: 'alice',
      publicName: 'Alice',
      profileImage: '/p.jpg',
      description: 'bio',
      socialLinks: {},
    };
    mockUserService.normalizeUsername.mockReturnValue('alice');
    mockUserService.findByUsername.mockResolvedValue(userDoc);
    mockProfileModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const dto = await service.getMergedPublicProfileByUsername('alice');
    expect(dto.username).toBe('alice');
    expect(mockUserService.normalizeUsername).toHaveBeenCalledWith('alice');
    expect(mockUserService.findByUsername).toHaveBeenCalledWith('alice');
  });

  it('getMergedPublicProfileByUsername throws when username unknown', async () => {
    mockUserService.normalizeUsername.mockReturnValue('nobody');
    mockUserService.findByUsername.mockResolvedValue(null);
    await expect(
      service.getMergedPublicProfileByUsername('nobody'),
    ).rejects.toThrow('User not found');
  });

  it('patchProfile updates publicName via UserService.update', async () => {
    const id = new mongoose.Types.ObjectId();
    const userDoc = {
      _id: id,
      username: 'alice',
      publicName: 'Old',
      profileImage: '/p.jpg',
      description: '',
      socialLinks: {},
    } as UserDocument;

    mockUserService.findByID.mockResolvedValue(userDoc);
    mockUserService.update.mockImplementation(async (u: UserDocument) => u);
    mockProfileModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const body: PatchProfileBody = { publicName: 'New Name' };
    const dto = await service.patchProfile(userDoc, body);

    expect(dto.publicName).toBe('New Name');
    expect(mockUserService.update).toHaveBeenCalled();
  });

  it('patchProfile no-op body returns current profile', async () => {
    const id = new mongoose.Types.ObjectId();
    const userDoc = {
      _id: id,
      username: 'alice',
      publicName: 'Alice',
      profileImage: '/p.jpg',
      description: '',
      socialLinks: {},
    } as UserDocument;

    mockUserService.findByID.mockResolvedValue(userDoc);
    mockProfileModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const dto = await service.patchProfile(userDoc, {});

    expect(dto.publicName).toBe('Alice');
    expect(mockUserService.update).not.toHaveBeenCalled();
  });
});
