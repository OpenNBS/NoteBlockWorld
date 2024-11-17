import { HttpException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';
import { SongPreviewDto } from '@shared/validation/song/dto/SongPreview.dto';
import { SongStats } from '@shared/validation/song/dto/SongStats';
import { SongViewDto } from '@shared/validation/song/dto/SongView.dto';
import { UploadSongDto } from '@shared/validation/song/dto/UploadSongDto.dto';
import { UploadSongResponseDto } from '@shared/validation/song/dto/UploadSongResponseDto.dto';
import mongoose, { Model } from 'mongoose';

import { FileService } from '@server/file/file.service';
import { UserDocument } from '@server/user/entity/user.entity';

import {
  Song as SongEntity,
  SongSchema,
  SongWithUser,
} from './entity/song.entity';
import { SongUploadService } from './song-upload/song-upload.service';
import { SongService } from './song.service';

const mockFileService = {
  deleteSong: jest.fn(),
  getSongDownloadUrl: jest.fn(),
};

const mockSongUploadService = {
  processUploadedSong: jest.fn(),
  processSongPatch: jest.fn(),
};

describe('SongService', () => {
  let service: SongService;
  let fileService: FileService;
  let songUploadService: SongUploadService;
  let songModel: Model<SongEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongService,
        {
          provide: getModelToken(SongEntity.name),
          useValue: mongoose.model(SongEntity.name, SongSchema),
        },
        {
          provide: FileService,
          useValue: mockFileService,
        },
        {
          provide: SongUploadService,
          useValue: mockSongUploadService,
        },
      ],
    }).compile();

    service = module.get<SongService>(SongService);
    fileService = module.get<FileService>(FileService);
    songUploadService = module.get<SongUploadService>(SongUploadService);
    songModel = module.get<Model<SongEntity>>(getModelToken(SongEntity.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadSong', () => {
    /* TODO: This test is timing out
    it('should upload a song', async () => {
      const file = { buffer: Buffer.from('test') } as Express.Multer.File;
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const body: UploadSongDto = {
        title: 'Test Song',
        originalAuthor: 'Test Author',
        description: 'Test Description',
        category: 'alternative',
        visibility: 'public',
        license: 'standard',
        customInstruments: [],
        thumbnailData: {
          startTick: 0,
          startLayer: 0,
          zoomLevel: 1,
          backgroundColor: '#000000',
        },
        allowDownload: true,
        file: 'somebytes',
      };

      const songEntity = new SongEntity();

      const songDocument: SongDocument = await songModel.create({
        ...body,
        publicId: 'public-song-id',
        createdAt: new Date(),
        stats: {} as SongStats,
        fileSize: 424242,
        packedSongUrl: 'http://test.com/packed-file.nbs',
        nbsFileUrl: 'http://test.com/file.nbs',
        thumbnailUrl: 'http://test.com/thumbnail.nbs',
        uploader: user._id,
      });

      const populatedSong = {
        ...songEntity,
        uploader: { username: 'testuser', profileImage: 'testimage' },
      } as unknown as SongWithUser;

      jest
        .spyOn(songUploadService, 'processUploadedSong')
        .mockResolvedValue(songEntity);

      jest.spyOn(songModel, 'create').mockResolvedValue({
        ...songDocument,
      } as any);

      jest.spyOn(songDocument, 'save').mockResolvedValue(songDocument);

      jest
        .spyOn(songDocument, 'populate')
        .mockResolvedValue(populatedSong as any);

      const result = await service.uploadSong({ file, user, body });

      expect(result).toEqual(
        UploadSongResponseDto.fromSongWithUserDocument(populatedSong),
      );

      expect(songUploadService.processUploadedSong).toHaveBeenCalledWith({
        file,
        user,
        body,
      });

      expect(songModel.create).toHaveBeenCalledWith(songEntity);
      expect(songDocument.save).toHaveBeenCalled();

      expect(songDocument.populate).toHaveBeenCalledWith(
        'uploader',
        'username profileImage -_id',
      );
    });
    */
  });

  describe('deleteSong', () => {
    it('should delete a song', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const songEntity = {
        title: 'Test Song',
        originalAuthor: 'Test Author',
        description: 'Test Description',
        category: 'alternative',
        visibility: 'public',
        license: 'standard',
        customInstruments: [],
        thumbnailData: {
          startTick: 0,
          startLayer: 0,
          zoomLevel: 1,
          backgroundColor: '#000000',
        },
        allowDownload: true,
        file: 'somebytes',
        publicId: 'public-song-id',
        createdAt: new Date(),
        stats: {} as SongStats,
        fileSize: 424242,
        packedSongUrl: 'http://test.com/packed-file.nbs',
        nbsFileUrl: 'http://test.com/file.nbs',
        thumbnailUrl: 'http://test.com/thumbnail.nbs',
        uploader: user._id,
      } as unknown as SongEntity;

      const populatedSong = {
        ...songEntity,
        uploader: { username: 'testuser', profileImage: 'testimage' },
      } as unknown as SongWithUser;

      const mockFindOne = {
        exec: jest.fn().mockResolvedValue({
          ...songEntity,
          populate: jest.fn().mockResolvedValue(populatedSong),
        }),
      };

      jest.spyOn(songModel, 'findOne').mockReturnValue(mockFindOne as any);

      jest.spyOn(songModel, 'deleteOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      } as any);

      jest.spyOn(fileService, 'deleteSong').mockResolvedValue(undefined);

      const result = await service.deleteSong(publicId, user);

      expect(result).toEqual(
        UploadSongResponseDto.fromSongWithUserDocument(populatedSong),
      );

      expect(songModel.findOne).toHaveBeenCalledWith({ publicId });
      expect(songModel.deleteOne).toHaveBeenCalledWith({ publicId });

      expect(fileService.deleteSong).toHaveBeenCalledWith(
        songEntity.nbsFileUrl,
      );
    });

    it('should throw an error if song is not found', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const mockFindOne = {
        findOne: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };

      jest.spyOn(songModel, 'findOne').mockReturnValue(mockFindOne as any);

      await expect(service.deleteSong(publicId, user)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if user is unauthorized', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const songEntity = new SongEntity();
      songEntity.uploader = new mongoose.Types.ObjectId(); // Different uploader

      const mockFindOne = {
        exec: jest.fn().mockResolvedValue(songEntity),
      };

      jest.spyOn(songModel, 'findOne').mockReturnValue(mockFindOne as any);

      await expect(service.deleteSong(publicId, user)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if user is unauthorized', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const songEntity = new SongEntity();

      jest.spyOn(songModel, 'findOne').mockResolvedValue(songEntity);

      await expect(service.deleteSong(publicId, user)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('patchSong', () => {
    it('should patch a song', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const body: UploadSongDto = {
        title: 'Test Song',
        originalAuthor: 'Test Author',
        description: 'Test Description',
        category: 'alternative',
        visibility: 'public',
        license: 'standard',
        customInstruments: [],
        thumbnailData: {
          startTick: 0,
          startLayer: 0,
          zoomLevel: 1,
          backgroundColor: '#000000',
        },
        allowDownload: true,
        file: 'somebytes',
      };

      const songEntity = await songModel.create(body);

      const populatedSong = {
        ...songEntity,
        uploader: { username: 'testuser', profileImage: 'testimage' },
      } as unknown as SongWithUser;

      jest.spyOn(songModel, 'findOne').mockResolvedValue(songEntity);

      jest
        .spyOn(songUploadService, 'processSongPatch')
        .mockResolvedValue(undefined);

      //jest.spyOn(songEntity, 'save').mockResolvedValue(songEntity);
      //jest.spyOn(songEntity, 'populate').mockResolvedValue(populatedSong);

      const result = await service.patchSong(publicId, body, user);

      expect(result).toEqual(
        UploadSongResponseDto.fromSongWithUserDocument(populatedSong),
      );

      expect(songModel.findOne).toHaveBeenCalledWith({ publicId });

      expect(songUploadService.processSongPatch).toHaveBeenCalledWith(
        songEntity,
        body,
        user,
      );

      expect(songEntity.save).toHaveBeenCalled();

      expect(songEntity.populate).toHaveBeenCalledWith(
        'uploader',
        'username profileImage -_id',
      );
    });

    it('should throw an error if song is not found', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const body: UploadSongDto = {
        title: 'Test Song',
        originalAuthor: 'Test Author',
        description: 'Test Description',
        category: 'alternative',
        visibility: 'public',
        license: 'standard',
        customInstruments: [],
        thumbnailData: {
          startTick: 0,
          startLayer: 0,
          zoomLevel: 1,
          backgroundColor: '#000000',
        },
        file: 'somebytes',
        allowDownload: false,
      };

      jest.spyOn(songModel, 'findOne').mockResolvedValue(null);

      await expect(service.patchSong(publicId, body, user)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if user is unauthorized', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const body: UploadSongDto = {
        title: 'Test Song',
        originalAuthor: 'Test Author',
        description: 'Test Description',
        category: 'alternative',
        visibility: 'public',
        license: 'standard',
        customInstruments: [],
        thumbnailData: {
          startTick: 0,
          startLayer: 0,
          zoomLevel: 1,
          backgroundColor: '#000000',
        },
        file: 'somebytes',
        allowDownload: false,
      };

      const songEntity = new SongEntity();

      jest.spyOn(songModel, 'findOne').mockResolvedValue(songEntity);

      await expect(service.patchSong(publicId, body, user)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getSongByPage', () => {
    it('should return a list of songs by page', async () => {
      const query: PageQueryDTO = {
        page: 1,
        limit: 10,
        sort: 'createdAt',
        order: true,
      };

      const songList: SongWithUser[] = [];

      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(songList),
      };

      jest.spyOn(songModel, 'find').mockResolvedValue(mockFind as any);

      const result = await service.getSongByPage(query);

      expect(result).toEqual(
        songList.map((song) => SongPreviewDto.fromSongDocumentWithUser(song)),
      );

      expect(songModel.find).toHaveBeenCalledWith({ visibility: 'public' });
    });

    it('should throw an error if query parameters are invalid', async () => {
      const query: PageQueryDTO = {
        page: -1,
        limit: -1,
        sort: 'invalid',
        order: false,
      };

      await expect(service.getSongByPage(query)).rejects.toThrow(HttpException);
    });
  });

  describe('getSong', () => {
    it('should return song info by ID', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const songEntity = await songModel.create({
        title: 'Test Song',
        originalAuthor: 'Test Author',
        description: 'Test Description',
        category: 'alternative',
        visibility: 'public',
        license: 'standard',
        customInstruments: [],
        thumbnailData: {
          startTick: 0,
          startLayer: 0,
          zoomLevel: 1,
          backgroundColor: '#000000',
        },
        file: 'somebytes',
        allowDownload: false,
      });

      jest.spyOn(songModel, 'findOne').mockResolvedValue(songEntity);

      const result = await service.getSong(publicId, user);

      expect(result).toEqual(SongViewDto.fromSongDocument(songEntity));
      expect(songModel.findOne).toHaveBeenCalledWith({ publicId });
    });

    it('should throw an error if song is not found', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      jest.spyOn(songModel, 'findOne').mockResolvedValue(null);

      await expect(service.getSong(publicId, user)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if song is private and user is unauthorized', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const songEntity = {
        visibility: 'private',
        uploader: 'different-user-id',
      } as unknown as SongEntity;

      const mockFindOne = {
        findOne: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(songEntity),
      };

      jest.spyOn(songModel, 'findOne').mockReturnValue(mockFindOne as any);

      await expect(service.getSongDownloadUrl(publicId, user)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getSongDownloadUrl', () => {
    it('should return song download URL', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const songEntity = new SongEntity();
      const url = 'test-url';

      jest.spyOn(songModel, 'findOne').mockResolvedValue(songEntity);
      jest.spyOn(fileService, 'getSongDownloadUrl').mockResolvedValue(url);

      const result = await service.getSongDownloadUrl(publicId, user);

      expect(result).toEqual(url);
      expect(songModel.findOne).toHaveBeenCalledWith({ publicId });

      expect(fileService.getSongDownloadUrl).toHaveBeenCalledWith(
        songEntity.nbsFileUrl,
        `${songEntity.title}.nbs`,
      );
    });

    it('should throw an error if song is not found', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      jest.spyOn(songModel, 'findOne').mockResolvedValue(null);

      await expect(service.getSongDownloadUrl(publicId, user)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if song is private and user is unauthorized', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const songEntity = new SongEntity();
      songEntity.visibility = 'private';

      jest.spyOn(songModel, 'findOne').mockResolvedValue(songEntity);

      await expect(service.getSongDownloadUrl(publicId, user)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getMySongsPage', () => {
    it('should return a list of songs uploaded by the user', async () => {
      const query: PageQueryDTO = {
        page: 1,
        limit: 10,
        sort: 'createdAt',
        order: true,
      };

      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const songList: SongWithUser[] = [];

      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(songList),
      };

      jest.spyOn(songModel, 'find').mockResolvedValue(mockFind as any);
      jest.spyOn(songModel, 'countDocuments').mockResolvedValue(0);

      const result = await service.getMySongsPage({ query, user });

      expect(result).toEqual({
        content: songList.map((song) =>
          SongPreviewDto.fromSongDocumentWithUser(song),
        ),
        page: 1,
        limit: 10,
        total: 0,
      });

      expect(songModel.find).toHaveBeenCalledWith({ uploader: user._id });

      expect(songModel.countDocuments).toHaveBeenCalledWith({
        uploader: user._id,
      });
    });
  });

  describe('getSongEdit', () => {
    it('should return song info for editing by ID', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const songEntity = new SongEntity();
      songEntity.uploader = user._id; // Ensure uploader is set

      const mockFindOne = {
        exec: jest.fn().mockResolvedValue(songEntity),
        populate: jest.fn().mockReturnThis(),
      };

      jest.spyOn(songModel, 'findOne').mockReturnValue(mockFindOne as any);

      const result = await service.getSongEdit(publicId, user);

      expect(result).toEqual(UploadSongDto.fromSongDocument(songEntity as any));

      expect(songModel.findOne).toHaveBeenCalledWith({ publicId });
    });

    it('should throw an error if song is not found', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const findOneMock = {
        findOne: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };

      jest.spyOn(songModel, 'findOne').mockReturnValue(findOneMock as any);

      await expect(service.getSongEdit(publicId, user)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if user is unauthorized', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const songEntity = {
        uploader: 'different-user-id',
        title: 'Test Song',
        originalAuthor: 'Test Author',
        description: 'Test Description',
        category: 'alternative',
        visibility: 'public',
        license: 'standard',
        customInstruments: [],
        thumbnailData: {
          startTick: 0,
          startLayer: 0,
          zoomLevel: 1,
          backgroundColor: '#000000',
        },
        allowDownload: true,
        publicId: 'public-song-id',
        createdAt: new Date(),
        stats: {} as SongStats,
        fileSize: 424242,
        packedSongUrl: 'http://test.com/packed-file.nbs',
        nbsFileUrl: 'http://test.com/file.nbs',
        thumbnailUrl: 'http://test.com/thumbnail.nbs',
      } as unknown as SongEntity;

      const findOneMock = {
        findOne: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(songEntity),
      };

      jest.spyOn(songModel, 'findOne').mockReturnValue(findOneMock as any);

      await expect(service.getSongEdit(publicId, user)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getCategories', () => {
    it('should return a list of song categories and their counts', async () => {
      const categories = [
        { _id: 'category1', count: 10 },
        { _id: 'category2', count: 5 },
      ];

      jest.spyOn(songModel, 'aggregate').mockResolvedValue(categories);

      const result = await service.getCategories();

      expect(result).toEqual({ category1: 10, category2: 5 });

      expect(songModel.aggregate).toHaveBeenCalledWith([
        { $match: { visibility: 'public' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);
    });
  });

  describe('getSongsByCategory', () => {
    it('should return a list of songs by category', async () => {
      const category = 'test-category';
      const page = 1;
      const limit = 10;
      const songList: SongWithUser[] = [];

      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(songList),
      };

      jest.spyOn(songModel, 'find').mockReturnValue(mockFind as any);

      const result = await service.getSongsByCategory(category, page, limit);

      expect(result).toEqual(
        songList.map((song) => SongPreviewDto.fromSongDocumentWithUser(song)),
      );

      expect(songModel.find).toHaveBeenCalledWith({
        category,
        visibility: 'public',
      });

      expect(mockFind.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockFind.skip).toHaveBeenCalledWith(page * limit - limit);
      expect(mockFind.limit).toHaveBeenCalledWith(limit);

      expect(mockFind.populate).toHaveBeenCalledWith(
        'uploader',
        'username profileImage -_id',
      );

      expect(mockFind.exec).toHaveBeenCalled();
    });
  });
});
