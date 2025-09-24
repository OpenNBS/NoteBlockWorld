import type { UserDocument } from '@nbw/database';
import {
  SongDocument,
  Song as SongEntity,
  SongPreviewDto,
  SongSchema,
  SongStats,
  SongViewDto,
  SongWithUser,
  UploadSongDto,
  UploadSongResponseDto
} from '@nbw/database';
import { HttpException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Model } from 'mongoose';

import { FileService } from '@server/file/file.service';

import { SongUploadService } from './song-upload/song-upload.service';
import { SongWebhookService } from './song-webhook/song-webhook.service';
import { SongService } from './song.service';

const mockFileService = {
  deleteSong        : jest.fn(),
  getSongDownloadUrl: jest.fn()
};

const mockSongUploadService = {
  processUploadedSong: jest.fn(),
  processSongPatch   : jest.fn()
};

const mockSongWebhookService = {
  syncAllSongsWebhook: jest.fn(),
  postSongWebhook    : jest.fn(),
  updateSongWebhook  : jest.fn(),
  deleteSongWebhook  : jest.fn(),
  syncSongWebhook    : jest.fn()
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
          provide : SongWebhookService,
          useValue: mockSongWebhookService
        },
        {
          provide : getModelToken(SongEntity.name),
          useValue: mongoose.model(SongEntity.name, SongSchema)
        },
        {
          provide : FileService,
          useValue: mockFileService
        },
        {
          provide : SongUploadService,
          useValue: mockSongUploadService
        }
      ]
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
    it('should upload a song', async () => {
      const file = { buffer: Buffer.from('test') } as Express.Multer.File;
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const body: UploadSongDto = {
        title            : 'Test Song',
        originalAuthor   : 'Test Author',
        description      : 'Test Description',
        category         : 'alternative',
        visibility       : 'public',
        license          : 'standard',
        customInstruments: [],
        thumbnailData    : {
          startTick      : 0,
          startLayer     : 0,
          zoomLevel      : 1,
          backgroundColor: '#000000'
        },
        allowDownload: true,
        file         : 'somebytes'
      };

      const commonData = {
        publicId : 'public-song-id',
        createdAt: new Date(),
        stats    : {
          midiFileName              : 'test.mid',
          noteCount                 : 100,
          tickCount                 : 1000,
          layerCount                : 10,
          tempo                     : 120,
          tempoRange                : [100, 150],
          timeSignature             : 4,
          duration                  : 60,
          loop                      : true,
          loopStartTick             : 0,
          minutesSpent              : 10,
          vanillaInstrumentCount    : 10,
          customInstrumentCount     : 0,
          firstCustomInstrumentIndex: 0,
          outOfRangeNoteCount       : 0,
          detunedNoteCount          : 0,
          customInstrumentNoteCount : 0,
          incompatibleNoteCount     : 0,
          compatible                : true,
          instrumentNoteCounts      : [10]
        },
        fileSize     : 424242,
        packedSongUrl: 'http://test.com/packed-file.nbs',
        nbsFileUrl   : 'http://test.com/file.nbs',
        thumbnailUrl : 'http://test.com/thumbnail.nbs',
        uploader     : user._id
      };

      const songEntity = new SongEntity();
      songEntity.uploader = user._id;

      const songDocument: SongDocument = {
        ...songEntity,
        ...commonData
      } as any;

      songDocument.populate = jest.fn().mockResolvedValue({
        ...songEntity,
        ...commonData,
        uploader: { username: 'testuser', profileImage: 'testimage' }
      } as unknown as SongWithUser);

      songDocument.save = jest.fn().mockResolvedValue(songDocument);

      const populatedSong = {
        ...songEntity,
        ...commonData,
        uploader: { username: 'testuser', profileImage: 'testimage' }
      } as unknown as SongWithUser;

      jest
        .spyOn(songUploadService, 'processUploadedSong')
        .mockResolvedValue(songEntity);

      jest.spyOn(songModel, 'create').mockResolvedValue(songDocument as any);

      const result = await service.uploadSong({ file, user, body });

      expect(result).toEqual(
        UploadSongResponseDto.fromSongWithUserDocument(populatedSong)
      );

      expect(songUploadService.processUploadedSong).toHaveBeenCalledWith({
        file,
        user,
        body
      });

      expect(songModel.create).toHaveBeenCalledWith(songEntity);
      expect(songDocument.save).toHaveBeenCalled();

      expect(songDocument.populate).toHaveBeenCalledWith(
        'uploader',
        'username profileImage -_id'
      );
    });
  });

  describe('deleteSong', () => {
    it('should delete a song', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const songEntity = {
        title            : 'Test Song',
        originalAuthor   : 'Test Author',
        description      : 'Test Description',
        category         : 'alternative',
        visibility       : 'public',
        license          : 'standard',
        customInstruments: [],
        thumbnailData    : {
          startTick      : 0,
          startLayer     : 0,
          zoomLevel      : 1,
          backgroundColor: '#000000'
        },
        allowDownload: true,
        file         : 'somebytes',
        publicId     : 'public-song-id',
        createdAt    : new Date(),
        stats        : {} as SongStats,
        fileSize     : 424242,
        packedSongUrl: 'http://test.com/packed-file.nbs',
        nbsFileUrl   : 'http://test.com/file.nbs',
        thumbnailUrl : 'http://test.com/thumbnail.nbs',
        uploader     : user._id
      } as unknown as SongEntity;

      const populatedSong = {
        ...songEntity,
        uploader: { username: 'testuser', profileImage: 'testimage' }
      } as unknown as SongWithUser;

      const mockFindOne = {
        exec: jest.fn().mockResolvedValue({
          ...songEntity,
          populate: jest.fn().mockResolvedValue(populatedSong)
        })
      };

      jest.spyOn(songModel, 'findOne').mockReturnValue(mockFindOne as any);

      jest.spyOn(songModel, 'deleteOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue({})
      } as any);

      jest.spyOn(fileService, 'deleteSong').mockResolvedValue(undefined);

      const result = await service.deleteSong(publicId, user);

      expect(result).toEqual(
        UploadSongResponseDto.fromSongWithUserDocument(populatedSong)
      );

      expect(songModel.findOne).toHaveBeenCalledWith({ publicId });
      expect(songModel.deleteOne).toHaveBeenCalledWith({ publicId });

      expect(fileService.deleteSong).toHaveBeenCalledWith(
        songEntity.nbsFileUrl
      );
    });

    it('should throw an error if song is not found', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const mockFindOne = {
        findOne: jest.fn().mockReturnThis(),
        exec   : jest.fn().mockResolvedValue(null)
      };

      jest.spyOn(songModel, 'findOne').mockReturnValue(mockFindOne as any);

      await expect(service.deleteSong(publicId, user)).rejects.toThrow(
        HttpException
      );
    });

    it('should throw an error if user is unauthorized', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const songEntity = new SongEntity();
      songEntity.uploader = new mongoose.Types.ObjectId(); // Different uploader

      const mockFindOne = {
        exec: jest.fn().mockResolvedValue(songEntity)
      };

      jest.spyOn(songModel, 'findOne').mockReturnValue(mockFindOne as any);

      await expect(service.deleteSong(publicId, user)).rejects.toThrow(
        HttpException
      );
    });

    it('should throw an error if user is unauthorized', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const songEntity = new SongEntity();
      songEntity.uploader = new mongoose.Types.ObjectId(); // Different uploader

      const mockFindOne = {
        exec: jest.fn().mockResolvedValue(songEntity)
      };

      jest.spyOn(songModel, 'findOne').mockReturnValue(mockFindOne as any);

      await expect(service.deleteSong(publicId, user)).rejects.toThrow(
        HttpException
      );
    });
  });

  describe('patchSong', () => {
    it('should patch a song', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const body: UploadSongDto = {
        title            : 'Test Song',
        originalAuthor   : 'Test Author',
        description      : 'Test Description',
        category         : 'alternative',
        visibility       : 'public',
        license          : 'standard',
        customInstruments: [],
        thumbnailData    : {
          startTick      : 0,
          startLayer     : 0,
          zoomLevel      : 1,
          backgroundColor: '#000000'
        },
        allowDownload: true,
        file         : 'somebytes'
      };

      const missingData = {
        publicId : 'public-song-id',
        createdAt: new Date(),
        stats    : {
          midiFileName              : 'test.mid',
          noteCount                 : 100,
          tickCount                 : 1000,
          layerCount                : 10,
          tempo                     : 120,
          tempoRange                : [100, 150],
          timeSignature             : 4,
          duration                  : 60,
          loop                      : true,
          loopStartTick             : 0,
          minutesSpent              : 10,
          vanillaInstrumentCount    : 10,
          customInstrumentCount     : 0,
          firstCustomInstrumentIndex: 0,
          outOfRangeNoteCount       : 0,
          detunedNoteCount          : 0,
          customInstrumentNoteCount : 0,
          incompatibleNoteCount     : 0,
          compatible                : true,
          instrumentNoteCounts      : [10]
        },
        fileSize     : 424242,
        packedSongUrl: 'http://test.com/packed-file.nbs',
        nbsFileUrl   : 'http://test.com/file.nbs',
        thumbnailUrl : 'http://test.com/thumbnail.nbs',
        uploader     : user._id
      };

      const songDocument: SongDocument = {
        ...missingData
      } as any;

      songDocument.save = jest.fn().mockResolvedValue(songDocument);

      songDocument.populate = jest.fn().mockResolvedValue({
        ...missingData,
        uploader: { username: 'testuser', profileImage: 'testimage' }
      });

      const populatedSong = {
        ...missingData,
        uploader: { username: 'testuser', profileImage: 'testimage' }
      };

      jest.spyOn(songModel, 'findOne').mockResolvedValue(songDocument);

      jest
        .spyOn(songUploadService, 'processSongPatch')
        .mockResolvedValue(undefined);

      const result = await service.patchSong(publicId, body, user);

      expect(result).toEqual(
        UploadSongResponseDto.fromSongWithUserDocument(populatedSong as any)
      );

      expect(songModel.findOne).toHaveBeenCalledWith({ publicId });

      expect(songUploadService.processSongPatch).toHaveBeenCalledWith(
        songDocument,
        body,
        user
      );

      expect(songDocument.save).toHaveBeenCalled();

      expect(songDocument.populate).toHaveBeenCalledWith(
        'uploader',
        'username profileImage -_id'
      );
    }, 10000); // Increase the timeout to 10000 ms

    it('should throw an error if song is not found', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const body: UploadSongDto = {
        title            : 'Test Song',
        originalAuthor   : 'Test Author',
        description      : 'Test Description',
        category         : 'alternative',
        visibility       : 'public',
        license          : 'standard',
        customInstruments: [],
        thumbnailData    : {
          startTick      : 0,
          startLayer     : 0,
          zoomLevel      : 1,
          backgroundColor: '#000000'
        },
        file         : 'somebytes',
        allowDownload: false
      };

      jest.spyOn(songModel, 'findOne').mockReturnValue(null as any);

      await expect(service.patchSong(publicId, body, user)).rejects.toThrow(
        HttpException
      );
    });

    it('should throw an error if user is unauthorized', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const body: UploadSongDto = {
        title            : 'Test Song',
        originalAuthor   : 'Test Author',
        description      : 'Test Description',
        category         : 'alternative',
        visibility       : 'public',
        license          : 'standard',
        customInstruments: [],
        thumbnailData    : {
          startTick      : 0,
          startLayer     : 0,
          zoomLevel      : 1,
          backgroundColor: '#000000'
        },
        file         : 'somebytes',
        allowDownload: false
      };

      const songEntity = {
        uploader: 'different-user-id'
      } as any;

      jest.spyOn(songModel, 'findOne').mockReturnValue(songEntity as any);

      await expect(service.patchSong(publicId, body, user)).rejects.toThrow(
        HttpException
      );
    });

    it('should throw an error if user is unauthorized', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const body: UploadSongDto = {
        title            : 'Test Song',
        originalAuthor   : 'Test Author',
        description      : 'Test Description',
        category         : 'alternative',
        visibility       : 'public',
        license          : 'standard',
        customInstruments: [],
        thumbnailData    : {
          startTick      : 0,
          startLayer     : 0,
          zoomLevel      : 1,
          backgroundColor: '#000000'
        },
        file         : 'somebytes',
        allowDownload: false
      };

      const songEntity = {
        uploader: 'different-user-id'
      } as any;

      jest.spyOn(songModel, 'findOne').mockReturnValue(songEntity);

      await expect(service.patchSong(publicId, body, user)).rejects.toThrow(
        HttpException
      );
    });

    it('should throw an error if user no changes are provided', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const body: UploadSongDto = {
        file          : undefined,
        allowDownload : false,
        visibility    : 'public',
        title         : '',
        originalAuthor: '',
        description   : '',
        category      : 'pop',
        thumbnailData : {
          backgroundColor: '#000000',
          startLayer     : 0,
          startTick      : 0,
          zoomLevel      : 1
        },
        license          : 'standard',
        customInstruments: []
      };

      const songEntity = {
        uploader      : user._id,
        file          : undefined,
        allowDownload : false,
        visibility    : 'public',
        title         : '',
        originalAuthor: '',
        description   : '',
        category      : 'pop',
        thumbnailData : {
          backgroundColor: '#000000',
          startLayer     : 0,
          startTick      : 0,
          zoomLevel      : 1
        },
        license          : 'standard',
        customInstruments: []
      } as any;

      jest.spyOn(songModel, 'findOne').mockReturnValue(songEntity as any);

      await expect(service.patchSong(publicId, body, user)).rejects.toThrow(
        HttpException
      );
    });
  });

  describe('getSongByPage', () => {
    it('should return a list of songs by page', async () => {
      const query = {
        page : 1,
        limit: 10,
        sort : 'createdAt',
        order: true
      };

      const songList: SongWithUser[] = [];

      const mockFind = {
        sort    : jest.fn().mockReturnThis(),
        skip    : jest.fn().mockReturnThis(),
        limit   : jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec    : jest.fn().mockResolvedValue(songList)
      };

      jest.spyOn(songModel, 'find').mockReturnValue(mockFind as any);

      const result = await service.getSongByPage(query);

      expect(result).toEqual(
        songList.map((song) => SongPreviewDto.fromSongDocumentWithUser(song))
      );

      expect(songModel.find).toHaveBeenCalledWith({ visibility: 'public' });
      expect(mockFind.sort).toHaveBeenCalledWith({ createdAt: 1 });

      expect(mockFind.skip).toHaveBeenCalledWith(
        query.page * query.limit - query.limit
      );

      expect(mockFind.limit).toHaveBeenCalledWith(query.limit);
      expect(mockFind.exec).toHaveBeenCalled();
    });

    it('should throw an error if the query is invalid', async () => {
      const query = {
        page : undefined,
        limit: undefined,
        sort : undefined,
        order: true
      };

      const songList: SongWithUser[] = [];

      const mockFind = {
        sort    : jest.fn().mockReturnThis(),
        skip    : jest.fn().mockReturnThis(),
        limit   : jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec    : jest.fn().mockResolvedValue(songList)
      };

      jest.spyOn(songModel, 'find').mockReturnValue(mockFind as any);

      expect(service.getSongByPage(query)).rejects.toThrow(HttpException);
    });
  });

  describe('getSong', () => {
    it('should return song info by ID', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const songDocument = {
        title            : 'Test Song',
        originalAuthor   : 'Test Author',
        description      : 'Test Description',
        category         : 'alternative',
        visibility       : 'public',
        license          : 'standard',
        customInstruments: [],
        thumbnailData    : {
          startTick      : 0,
          startLayer     : 0,
          zoomLevel      : 1,
          backgroundColor: '#000000'
        },
        file         : 'somebytes',
        allowDownload: false,
        uploader     : {},
        save         : jest.fn()
      } as any;

      songDocument.save = jest.fn().mockResolvedValue(songDocument);

      const mockFindOne = {
        populate: jest.fn().mockResolvedValue(songDocument),
        ...songDocument
      };

      jest.spyOn(songModel, 'findOne').mockReturnValue(mockFindOne as any);

      const result = await service.getSong(publicId, user);

      expect(result).toEqual(SongViewDto.fromSongDocument(songDocument));
      expect(songModel.findOne).toHaveBeenCalledWith({ publicId });
    });

    it('should throw an error if song is not found', async () => {
      const publicId = 'test-id';

      const user: UserDocument = {
        _id: 'test-user-id'
      } as unknown as UserDocument;

      const mockFindOne = null;

      jest.spyOn(songModel, 'findOne').mockReturnValue(mockFindOne as any);

      await expect(service.getSong(publicId, user)).rejects.toThrow(
        HttpException
      );
    });

    it('should throw an error if song is private and user is unauthorized', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const songEntity = {
        publicId  : 'test-public-id',
        visibility: 'private',
        uploader  : 'different-user-id'
      };

      jest.spyOn(songModel, 'findOne').mockReturnValue(songEntity as any);

      expect(service.getSong(publicId, user)).rejects.toThrow(HttpException);
    });

    it('should throw an error if song is private and user is not logged in', async () => {
      const publicId = 'test-id';
      const user: UserDocument = null as any;

      const songEntity = {
        publicId  : 'test-public-id',
        visibility: 'private',
        uploader  : 'different-user-id'
      };

      jest.spyOn(songModel, 'findOne').mockReturnValue(songEntity as any);
      expect(service.getSong(publicId, user)).rejects.toThrow(HttpException);
    });
  });

  describe('getSongDownloadUrl', () => {
    it('should return song download URL', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const songEntity = {
        visibility       : 'public',
        uploader         : 'test-user-id',
        title            : 'Test Song',
        originalAuthor   : 'Test Author',
        description      : 'Test Description',
        category         : 'alternative',
        license          : 'standard',
        customInstruments: [],
        thumbnailData    : {
          startTick      : 0,
          startLayer     : 0,
          zoomLevel      : 1,
          backgroundColor: '#000000'
        },
        allowDownload: true,
        publicId     : 'public-song-id',
        createdAt    : new Date(),
        stats        : {} as SongStats,
        fileSize     : 424242,
        packedSongUrl: 'http://test.com/packed-file.nbs',
        nbsFileUrl   : 'http://test.com/file.nbs',
        thumbnailUrl : 'http://test.com/thumbnail.nbs',
        save         : jest.fn()
      };

      const url = 'http://test.com/song.nbs';

      jest.spyOn(songModel, 'findOne').mockResolvedValue(songEntity);
      jest.spyOn(fileService, 'getSongDownloadUrl').mockResolvedValue(url);

      const result = await service.getSongDownloadUrl(publicId, user);

      expect(result).toEqual(url);
      expect(songModel.findOne).toHaveBeenCalledWith({ publicId });

      expect(fileService.getSongDownloadUrl).toHaveBeenCalledWith(
        songEntity.nbsFileUrl,
        `${songEntity.title}.nbs`
      );
    });

    it('should throw an error if song is not found', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      jest.spyOn(songModel, 'findOne').mockResolvedValue(null);

      await expect(service.getSongDownloadUrl(publicId, user)).rejects.toThrow(
        HttpException
      );
    });

    it('should throw an error if song is private and user is unauthorized', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const songEntity = {
        visibility: 'private',
        uploader  : 'different-user-id'
      };

      jest.spyOn(songModel, 'findOne').mockResolvedValue(songEntity);

      await expect(service.getSongDownloadUrl(publicId, user)).rejects.toThrow(
        HttpException
      );
    });

    it('should throw an error if no packed song URL is available and allowDownload is false', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const songEntity = {
        visibility       : 'public',
        uploader         : 'test-user-id',
        title            : 'Test Song',
        originalAuthor   : 'Test Author',
        description      : 'Test Description',
        category         : 'alternative',
        license          : 'standard',
        customInstruments: [],
        thumbnailData    : {
          startTick      : 0,
          startLayer     : 0,
          zoomLevel      : 1,
          backgroundColor: '#000000'
        },
        allowDownload: false,
        publicId     : 'public-song-id',
        createdAt    : new Date(),
        stats        : {} as SongStats,
        fileSize     : 424242,
        packedSongUrl: undefined,
        nbsFileUrl   : 'http://test.com/file.nbs',
        thumbnailUrl : 'http://test.com/thumbnail.nbs',
        save         : jest.fn()
      };

      jest.spyOn(songModel, 'findOne').mockResolvedValue(songEntity);

      await expect(service.getSongDownloadUrl(publicId, user)).rejects.toThrow(
        HttpException
      );
    });

    it('should throw an error in case of an internal error in fileService', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      jest
        .spyOn(fileService, 'getSongDownloadUrl')
        .mockImplementationOnce(() => {
          throw new Error('Internal error');
        });

      await expect(service.getSongDownloadUrl(publicId, user)).rejects.toThrow(
        HttpException
      );
    });

    it('should throw an error in case of an internal error on saving the song', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const songEntity = {
        visibility       : 'public',
        uploader         : 'test-user-id',
        title            : 'Test Song',
        originalAuthor   : 'Test Author',
        description      : 'Test Description',
        category         : 'alternative',
        license          : 'standard',
        customInstruments: [],
        thumbnailData    : {
          startTick      : 0,
          startLayer     : 0,
          zoomLevel      : 1,
          backgroundColor: '#000000'
        },
        allowDownload: true,
        publicId     : 'public-song-id',
        createdAt    : new Date(),
        stats        : {} as SongStats,
        fileSize     : 424242,
        packedSongUrl: 'http://test.com/packed-file.nbs',
        nbsFileUrl   : 'http://test.com/file.nbs',
        thumbnailUrl : 'http://test.com/thumbnail.nbs',
        save         : jest.fn().mockImplementationOnce(() => {
          throw new Error('Error saving song');
        })
      };

      jest.spyOn(songModel, 'findOne').mockResolvedValue(songEntity);

      jest
        .spyOn(fileService, 'getSongDownloadUrl')
        .mockResolvedValue('http://test.com/song.nbs');

      await expect(service.getSongDownloadUrl(publicId, user)).rejects.toThrow(
        HttpException
      );
    });
  });

  describe('getMySongsPage', () => {
    it('should return a list of songs uploaded by the user', async () => {
      const query = {
        page : 1,
        limit: 10,
        sort : 'createdAt',
        order: true
      };

      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;
      const songList: SongWithUser[] = [];

      const mockFind = {
        sort : jest.fn().mockReturnThis(),
        skip : jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(songList)
      };

      jest.spyOn(songModel, 'find').mockReturnValue(mockFind as any);
      jest.spyOn(songModel, 'countDocuments').mockResolvedValue(0);

      const result = await service.getMySongsPage({ query, user });

      expect(result).toEqual({
        content: songList.map((song) =>
          SongPreviewDto.fromSongDocumentWithUser(song)
        ),
        page : 1,
        limit: 10,
        total: 0
      });

      expect(songModel.find).toHaveBeenCalledWith({ uploader: user._id });
      expect(mockFind.sort).toHaveBeenCalledWith({ createdAt: 1 });

      expect(mockFind.skip).toHaveBeenCalledWith(
        query.page * query.limit - query.limit
      );

      expect(mockFind.limit).toHaveBeenCalledWith(query.limit);

      expect(songModel.countDocuments).toHaveBeenCalledWith({
        uploader: user._id
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
        exec    : jest.fn().mockResolvedValue(songEntity),
        populate: jest.fn().mockReturnThis()
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
        exec   : jest.fn().mockResolvedValue(null)
      };

      jest.spyOn(songModel, 'findOne').mockReturnValue(findOneMock as any);

      await expect(service.getSongEdit(publicId, user)).rejects.toThrow(
        HttpException
      );
    });

    it('should throw an error if user is unauthorized', async () => {
      const publicId = 'test-id';
      const user: UserDocument = { _id: 'test-user-id' } as UserDocument;

      const songEntity = {
        uploader         : 'different-user-id',
        title            : 'Test Song',
        originalAuthor   : 'Test Author',
        description      : 'Test Description',
        category         : 'alternative',
        visibility       : 'public',
        license          : 'standard',
        customInstruments: [],
        thumbnailData    : {
          startTick      : 0,
          startLayer     : 0,
          zoomLevel      : 1,
          backgroundColor: '#000000'
        },
        allowDownload: true,
        publicId     : 'public-song-id',
        createdAt    : new Date(),
        stats        : {} as SongStats,
        fileSize     : 424242,
        packedSongUrl: 'http://test.com/packed-file.nbs',
        nbsFileUrl   : 'http://test.com/file.nbs',
        thumbnailUrl : 'http://test.com/thumbnail.nbs'
      } as unknown as SongEntity;

      const findOneMock = {
        findOne: jest.fn().mockReturnThis(),
        exec   : jest.fn().mockResolvedValue(songEntity)
      };

      jest.spyOn(songModel, 'findOne').mockReturnValue(findOneMock as any);

      await expect(service.getSongEdit(publicId, user)).rejects.toThrow(
        HttpException
      );
    });
  });

  describe('getCategories', () => {
    it('should return a list of song categories and their counts', async () => {
      const categories = [
        { _id: 'category1', count: 10 },
        { _id: 'category2', count: 5 }
      ];

      jest.spyOn(songModel, 'aggregate').mockResolvedValue(categories);

      const result = await service.getCategories();

      expect(result).toEqual({ category1: 10, category2: 5 });

      expect(songModel.aggregate).toHaveBeenCalledWith([
        { $match: { visibility: 'public' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
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
        sort    : jest.fn().mockReturnThis(),
        skip    : jest.fn().mockReturnThis(),
        limit   : jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec    : jest.fn().mockResolvedValue(songList)
      };

      jest.spyOn(songModel, 'find').mockReturnValue(mockFind as any);

      const result = await service.getSongsByCategory(category, page, limit);

      expect(result).toEqual(
        songList.map((song) => SongPreviewDto.fromSongDocumentWithUser(song))
      );

      expect(songModel.find).toHaveBeenCalledWith({
        category,
        visibility: 'public'
      });

      expect(mockFind.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockFind.skip).toHaveBeenCalledWith(page * limit - limit);
      expect(mockFind.limit).toHaveBeenCalledWith(limit);

      expect(mockFind.populate).toHaveBeenCalledWith(
        'uploader',
        'username profileImage -_id'
      );

      expect(mockFind.exec).toHaveBeenCalled();
    });
  });
});
