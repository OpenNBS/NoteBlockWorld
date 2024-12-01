import {
  Instrument,
  Layer,
  Note,
  Song,
  fromArrayBuffer,
} from '@encode42/nbs.js';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ThumbnailData } from '@shared/validation/song/dto/ThumbnailData.dto';
import { UploadSongDto } from '@shared/validation/song/dto/UploadSongDto.dto';
import { Types } from 'mongoose';

import { FileService } from '@server/file/file.service';
import { UserDocument } from '@server/user/entity/user.entity';
import { UserService } from '@server/user/user.service';

import { SongUploadService } from './song-upload.service';
import { SongDocument, Song as SongEntity } from '../entity/song.entity';

// mock drawToImage function
jest.mock('@shared/features/thumbnail', () => ({
  drawToImage: jest.fn().mockResolvedValue(Buffer.from('test')),
}));

const mockFileService = {
  uploadSong: jest.fn(),
  uploadPackedSong: jest.fn(),
  uploadThumbnail: jest.fn(),
  getSongFile: jest.fn(),
};

const mockUserService = {
  findByID: jest.fn(),
};

describe('SongUploadService', () => {
  let songUploadService: SongUploadService;
  let fileService: FileService;
  let _userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongUploadService,
        {
          provide: FileService,
          useValue: mockFileService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    songUploadService = module.get<SongUploadService>(SongUploadService);
    fileService = module.get<FileService>(FileService);
    _userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(songUploadService).toBeDefined();
  });

  describe('processUploadedSong', () => {
    it('should process and upload a song', async () => {
      const file = { buffer: Buffer.from('test') } as Express.Multer.File;

      const user: UserDocument = {
        _id: new Types.ObjectId(),
        username: 'testuser',
      } as UserDocument;

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
      songEntity.uploader = user._id;

      jest
        .spyOn(songUploadService as any, 'checkIsFileValid')
        .mockImplementation((_file: Express.Multer.File) => undefined);

      jest
        .spyOn(songUploadService as any, 'prepareSongForUpload')
        .mockReturnValue({
          nbsSong: new Song(),
          songBuffer: Buffer.from('test'),
        });

      jest
        .spyOn(songUploadService as any, 'preparePackedSongForUpload')
        .mockResolvedValue(Buffer.from('test'));

      jest
        .spyOn(songUploadService as any, 'generateSongDocument')
        .mockResolvedValue(songEntity);

      jest
        .spyOn(songUploadService, 'generateAndUploadThumbnail')
        .mockResolvedValue('http://test.com/thumbnail.png');

      jest
        .spyOn(songUploadService as any, 'uploadSongFile')
        .mockResolvedValue('http://test.com/file.nbs');

      jest
        .spyOn(songUploadService as any, 'uploadPackedSongFile')
        .mockResolvedValue('http://test.com/packed-file.nbs');

      const result = await songUploadService.processUploadedSong({
        file,
        user,
        body,
      });

      expect(result).toEqual(songEntity);

      expect((songUploadService as any).checkIsFileValid).toHaveBeenCalledWith(
        file,
      );

      expect(
        (songUploadService as any).prepareSongForUpload,
      ).toHaveBeenCalledWith(file.buffer, body, user);

      expect(
        (songUploadService as any).preparePackedSongForUpload,
      ).toHaveBeenCalledWith(expect.any(Song), body.customInstruments);

      expect(songUploadService.generateAndUploadThumbnail).toHaveBeenCalledWith(
        body.thumbnailData,
        expect.any(Song),
        expect.any(String),
      );

      expect((songUploadService as any).uploadSongFile).toHaveBeenCalledWith(
        expect.any(Buffer),
        expect.any(String),
      );

      expect(
        (songUploadService as any).uploadPackedSongFile,
      ).toHaveBeenCalledWith(expect.any(Buffer), expect.any(String));
    });
  });

  describe('processSongPatch', () => {
    it('should process and patch a song', async () => {
      const user: UserDocument = {
        _id: new Types.ObjectId(),
        username: 'testuser',
      } as UserDocument;

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

      const songDocument: SongDocument = {
        ...body,
        publicId: 'test-id',
        uploader: user._id,
        customInstruments: [],
        thumbnailData: body.thumbnailData,
        nbsFileUrl: 'http://test.com/file.nbs',
        save: jest.fn().mockResolvedValue({}),
      } as any;

      jest
        .spyOn(fileService, 'getSongFile')
        .mockResolvedValue(Buffer.from('test'));

      jest
        .spyOn(songUploadService as any, 'prepareSongForUpload')
        .mockReturnValue({
          nbsSong: new Song(),
          songBuffer: Buffer.from('test'),
        });

      jest
        .spyOn(songUploadService as any, 'preparePackedSongForUpload')
        .mockResolvedValue(Buffer.from('test'));

      jest
        .spyOn(songUploadService, 'generateAndUploadThumbnail')
        .mockResolvedValue('http://test.com/thumbnail.png');

      jest
        .spyOn(songUploadService as any, 'uploadSongFile')
        .mockResolvedValue('http://test.com/file.nbs');

      jest
        .spyOn(songUploadService as any, 'uploadPackedSongFile')
        .mockResolvedValue('http://test.com/packed-file.nbs');

      await songUploadService.processSongPatch(songDocument, body, user);
    });
  });

  describe('generateAndUploadThumbnail', () => {
    it('should generate and upload a thumbnail', async () => {
      const thumbnailData: ThumbnailData = {
        startTick: 0,
        startLayer: 0,
        zoomLevel: 1,
        backgroundColor: '#000000',
      };

      const nbsSong = new Song();
      nbsSong.addLayer(new Layer(1));
      nbsSong.addLayer(new Layer(2));
      const publicId = 'test-id';

      jest
        .spyOn(fileService, 'uploadThumbnail')
        .mockResolvedValue('http://test.com/thumbnail.png');

      const result = await songUploadService.generateAndUploadThumbnail(
        thumbnailData,
        nbsSong,
        publicId,
      );

      expect(result).toBe('http://test.com/thumbnail.png');

      expect(fileService.uploadThumbnail).toHaveBeenCalledWith(
        expect.any(Buffer),
        publicId,
      );
    });

    it('should throw an error if the thumbnail is invalid', async () => {
      const thumbnailData: ThumbnailData = {
        startTick: 0,
        startLayer: 0,
        zoomLevel: 1,
        backgroundColor: '#000000',
      };

      const nbsSong = new Song();
      const publicId = 'test-id';

      jest
        .spyOn(fileService, 'uploadThumbnail')
        // throw an error
        .mockRejectedValue(new Error('test error'));

      try {
        await songUploadService.generateAndUploadThumbnail(
          thumbnailData,
          nbsSong,
          publicId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('uploadSongFile', () => {
    it('should upload a song file', async () => {
      const file = Buffer.from('test');
      const publicId = 'test-id';

      jest
        .spyOn(fileService, 'uploadSong')
        .mockResolvedValue('http://test.com/file.nbs');

      const result = await (songUploadService as any).uploadSongFile(
        file,
        publicId,
      );

      expect(result).toBe('http://test.com/file.nbs');
      expect(fileService.uploadSong).toHaveBeenCalledWith(file, publicId);
    });

    it('should throw an error if the file is invalid', async () => {
      const file = Buffer.from('test');
      const publicId = 'test-id';

      jest
        .spyOn(fileService, 'uploadSong')
        .mockRejectedValue(new Error('test error'));

      try {
        await (songUploadService as any).uploadSongFile(file, publicId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('uploadPackedSongFile', () => {
    it('should upload a packed song file', async () => {
      const file = Buffer.from('test');
      const publicId = 'test-id';

      jest
        .spyOn(fileService, 'uploadPackedSong')
        .mockResolvedValue('http://test.com/packed-file.nbs');

      const result = await (songUploadService as any).uploadPackedSongFile(
        file,
        publicId,
      );

      expect(result).toBe('http://test.com/packed-file.nbs');
      expect(fileService.uploadPackedSong).toHaveBeenCalledWith(file, publicId);
    });

    it('should throw an error if the file is invalid', async () => {
      const file = Buffer.from('test');
      const publicId = 'test-id';

      jest
        .spyOn(fileService, 'uploadPackedSong')
        .mockRejectedValue(new Error('test error'));

      try {
        await (songUploadService as any).uploadPackedSongFile(file, publicId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('getSongObject', () => {
    it('should return a song object from an array buffer', () => {
      const songTest = new Song();

      songTest.meta = {
        author: 'Nicolas Vycas',
        description: 'super cool song',
        importName: 'test',
        name: 'Cool Test Song',
        originalAuthor: 'Nicolas Vycas',
      };

      songTest.tempo = 20;

      // The following will add 3 layers for 3 instruments, each containing five notes
      for (let layerCount = 0; layerCount < 3; layerCount++) {
        const instrument = Instrument.builtIn[layerCount];

        // Create a layer for the instrument
        const layer = songTest.createLayer();
        layer.meta.name = instrument.meta.name;

        const notes = [
          new Note(instrument, { key: 40 }),
          new Note(instrument, { key: 45 }),
          new Note(instrument, { key: 50 }),
          new Note(instrument, { key: 45 }),
          new Note(instrument, { key: 57 }),
        ];

        // Place the notes
        for (let i = 0; i < notes.length; i++) {
          songTest.setNote(i * 4, layer, notes[i]); // "i * 4" is placeholder - this is the tick to place on
        }
      }

      const buffer = songTest.toArrayBuffer();

      console.log(fromArrayBuffer(buffer).length);

      const song = songUploadService.getSongObject(buffer); //TODO: For some reason the song is always empty

      expect(song).toBeInstanceOf(Song);
    });

    it('should throw an error if the array buffer is invalid', () => {
      const buffer = new ArrayBuffer(0);

      expect(() => songUploadService.getSongObject(buffer)).toThrow(
        HttpException,
      );
    });
  });

  describe('checkIsFileValid', () => {
    it('should throw an error if the file is not provided', () => {
      expect(() => (songUploadService as any).checkIsFileValid(null)).toThrow(
        HttpException,
      );
    });

    it('should not throw an error if the file is provided', () => {
      const file = { buffer: Buffer.from('test') } as Express.Multer.File;

      expect(() =>
        (songUploadService as any).checkIsFileValid(file),
      ).not.toThrow();
    });
  });

  describe('getSoundsMapping', () => undefined);
  describe('getValidSoundsSubset', () => undefined);
  describe('validateUploader', () => undefined);
  describe('generateSongDocument', () => undefined);
  describe('prepareSongForUpload', () => undefined);
  describe('preparePackedSongForUpload', () => undefined);
});
