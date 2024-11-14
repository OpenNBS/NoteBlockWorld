import { HttpException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';
import { SongPreviewDto } from '@shared/validation/song/dto/SongPreview.dto';
import { UploadSongDto } from '@shared/validation/song/dto/UploadSongDto.dto';
import { UploadSongResponseDto } from '@shared/validation/song/dto/UploadSongResponseDto.dto';
import { Model } from 'mongoose';

import { FileService } from '@server/file/file.service';
import { UserDocument } from '@server/user/entity/user.entity';

import { Song as SongEntity, SongWithUser } from './entity/song.entity';
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

const mockSongModel = {
  create: jest.fn(),
  findOne: jest.fn(),
  deleteOne: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
  aggregate: jest.fn(),
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
          useValue: mockSongModel,
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

  // TODO: Add tests and fix mock implementations

  describe('uploadSong', () => {
    it('should upload a song', async () => {
      const file = { buffer: Buffer.from('test') } as Express.Multer.File;
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const body: UploadSongDto = {
        title: 'Test Song',
        allowDownload: false,
        file: 'test.nbs',
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
      };

      const songEntity = new SongEntity();
      const songDocument = new songModel(songEntity);

      const populatedSong = {
        ...songEntity,
        uploader: { username: 'testuser', profileImage: 'testimage' },
      } as unknown as SongWithUser;

      jest
        .spyOn(songUploadService, 'processUploadedSong')
        .mockResolvedValue(songEntity);

      //jest.spyOn(songModel, 'create').mockResolvedValue(songDocument);
      //jest.spyOn(songDocument, 'save').mockResolvedValue(songDocument);
      //jest.spyOn(songDocument, 'populate').mockResolvedValue(populatedSong);

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

    it('should throw an error if user is invalid', async () => {
      const file = { buffer: Buffer.from('test') } as Express.Multer.File;
      const user = null;

      const body: UploadSongDto = {
        title: 'Test Song',
        allowDownload: false,
        file: 'test.nbs',
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
      };

      await expect(service.uploadSong({ file, user, body })).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('deleteSong', () => {
    it('should delete a song', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const songEntity = new SongEntity();

      const populatedSong = {
        ...songEntity,
        uploader: { username: 'testuser', profileImage: 'testimage' },
      } as unknown as SongWithUser;

      jest.spyOn(songModel, 'findOne').mockResolvedValue(songEntity);
      jest.spyOn(songModel, 'deleteOne').mockResolvedValue({} as any);
      //jest.spyOn(songEntity, 'populate').mockResolvedValue(populatedSong);
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

      jest.spyOn(songModel, 'findOne').mockResolvedValue(null);

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
        allowDownload: false,
        file: 'test.nbs',
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
      };

      const songEntity = new SongEntity();

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

      //expect(songEntity.save).toHaveBeenCalled();

      //expect(songEntity.populate).toHaveBeenCalledWith(
      //  'uploader',
      //  'username profileImage -_id',
      //);
    });

    it('should throw an error if song is not found', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const body: UploadSongDto = {
        title: 'Test Song',
        allowDownload: false,
        file: 'test.nbs',
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
        allowDownload: false,
        file: 'test.nbs',
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

      jest.spyOn(songModel, 'find').mockResolvedValue(songList);

      const result = await service.getSongByPage(query);

      expect(result).toEqual(
        songList.map((song) => SongPreviewDto.fromSongDocumentWithUser(song)),
      );

      expect(songModel.find).toHaveBeenCalledWith({ visibility: 'public' });
    });

    it('should throw an error if query parameters are invalid', async () => {
      const query: PageQueryDTO = {
        page: undefined,
        limit: undefined,
        sort: undefined,
        order: undefined,
      };

      await expect(service.getSongByPage(query)).rejects.toThrow(HttpException);
    });
  });

  describe('getSong', () => {
    it('should return song info by ID', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const songEntity = new SongEntity();

      jest.spyOn(songModel, 'findOne').mockResolvedValue(songEntity);

      const result = await service.getSong(publicId, user);

      //expect(result).toEqual(SongViewDto.fromSongDocument(songEntity));
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
      const songEntity = new SongEntity();
      songEntity.visibility = 'private';

      jest.spyOn(songModel, 'findOne').mockResolvedValue(songEntity);

      await expect(service.getSong(publicId, user)).rejects.toThrow(
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

      jest.spyOn(songModel, 'find').mockResolvedValue(songList);
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

    it('should throw an error if user is not found', async () => {
      const query: PageQueryDTO = {
        page: 1,
        limit: 10,
        sort: 'createdAt',
        order: true,
      };

      const user = null;

      await expect(service.getMySongsPage({ query, user })).rejects.toThrow(
        HttpException,
      );
    });
  });
});
