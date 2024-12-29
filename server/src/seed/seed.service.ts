import { Instrument, Note, Song } from '@encode42/nbs.js';
import { faker } from '@faker-js/faker';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UploadConst } from '@shared/validation/song/constants';
import {
  CategoryType,
  LicenseType,
  VisibilityType,
} from '@shared/validation/song/dto/types';
import { UploadSongDto } from '@shared/validation/song/dto/UploadSongDto.dto';

import { SongDocument } from '@server/song/entity/song.entity';
import { SongService } from '@server/song/song.service';
import { UserDocument } from '@server/user/entity/user.entity';
import { UserService } from '@server/user/user.service';

@Injectable()
export class SeedService {
  public readonly logger = new Logger(SeedService.name);
  constructor(
    @Inject('NODE_ENV')
    private readonly NODE_ENV: string,

    @Inject(UserService)
    private readonly userService: UserService,

    @Inject(SongService)
    private readonly songService: SongService,
  ) {}

  public async seedDev() {
    if (this.NODE_ENV !== 'development') {
      this.logger.error('Seeding is only allowed in development mode');
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const createdUsers = await this.seedUsers();
    this.logger.log(`Created ${createdUsers.length} users`);
    const createdSongs = await this.seedSongs(createdUsers);
    this.logger.log(`Created ${createdSongs.length} songs`);
  }

  private async seedUsers() {
    const createdUsers: UserDocument[] = [];

    for (let i = 0; i < 100; i++) {
      const user = await this.userService.createWithPassword({
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: 'supersecretpassword', // all users have the same password for development purposes
      });

      //change user creation date
      (user as any).createdAt = this.generateRandomDate(
        new Date(2020, 0, 1),
        new Date(),
      );

      user.loginCount = faker.helpers.rangeToNumber({ min: 0, max: 1000 });
      user.playCount = faker.helpers.rangeToNumber({ min: 0, max: 1000 });
      user.description = faker.lorem.paragraph();

      user.socialLinks = {
        youtube: faker.internet.url(),
        x: faker.internet.url(),
        discord: faker.internet.url(),
        instagram: faker.internet.url(),
        twitch: faker.internet.url(),
        bandcamp: faker.internet.url(),
        facebook: faker.internet.url(),
        github: faker.internet.url(),
        reddit: faker.internet.url(),
        snapchat: faker.internet.url(),
        soundcloud: faker.internet.url(),
        spotify: faker.internet.url(),
        steam: faker.internet.url(),
        telegram: faker.internet.url(),
        tiktok: faker.internet.url(),
      };

      // remove some social links randomly to simulate users not having all of them or having none
      for (const key in Object.keys(user.socialLinks))
        if (faker.datatype.boolean()) delete (user.socialLinks as any)[key];

      createdUsers.push(await this.userService.update(user));
    }

    return createdUsers;
  }

  private async seedSongs(users: UserDocument[]) {
    const songs: SongDocument[] = [];
    const licenses = Object.keys(UploadConst.licenses);
    const categories = Object.keys(UploadConst.categories);
    const visibilities = Object.keys(UploadConst.visibility);

    for (const user of users) {
      // most users will have 0-5 songs and a few will have 5-10, not a real statist by whatever I just what to test the system in development mode
      const songCount = this.generateExponentialRandom(5, 2, 0.5, 10);

      for (let i = 0; i < songCount; i++) {
        const nbsSong = this.generateRandomSong();
        const fileData = nbsSong.toArrayBuffer();
        const fileBuffer = Buffer.from(fileData);
        this.logger.log(`Generated song has ${fileBuffer.length} bytes.`);

        const body: UploadSongDto = {
          file: {
            buffer: fileData,
            size: fileBuffer.length,
            mimetype: 'application/octet-stream',
            originalname: `${faker.music.songName()}.nbs`,
          },
          allowDownload: faker.datatype.boolean(),
          visibility: faker.helpers.arrayElement(
            visibilities,
          ) as VisibilityType,
          title: faker.music.songName(),
          originalAuthor: faker.music.artist(),
          description: faker.lorem.paragraph(),
          license: faker.helpers.arrayElement(licenses) as LicenseType,
          category: faker.helpers.arrayElement(categories) as CategoryType,
          customInstruments: [],
          thumbnailData: {
            backgroundColor: faker.internet.color(),
            startLayer: faker.helpers.rangeToNumber({ min: 0, max: 4 }),
            startTick: faker.helpers.rangeToNumber({ min: 0, max: 100 }),
            zoomLevel: faker.helpers.rangeToNumber({ min: 1, max: 5 }),
          },
        };

        const uploadSongResponse = await this.songService.uploadSong({
          user,
          body,
          file: body.file,
        });

        const song = await this.songService.getSongById(
          uploadSongResponse.publicId,
        );

        if (!song) continue;

        //change song creation date
        (song as any).createdAt = this.generateRandomDate(
          new Date(2020, 0, 1),
          new Date(),
        );

        song.playCount = faker.helpers.rangeToNumber({ min: 0, max: 1000 });
        song.downloadCount = faker.helpers.rangeToNumber({ min: 0, max: 1000 });
        song.likeCount = faker.helpers.rangeToNumber({ min: 0, max: 1000 });
        await song.save();

        songs.push(song);
      }
    }

    return songs;
  }

  private generateExponentialRandom(
    start = 1,
    stepScale = 2,
    stepProbability = 0.5,
    limit = Number.MAX_SAFE_INTEGER,
  ) {
    let max = start;

    while (faker.datatype.boolean(stepProbability) && max < limit) {
      max *= stepScale;
    }

    return faker.number.int({ min: 0, max: Math.min(max, limit) });
  }

  private generateRandomSong() {
    const songTest = new Song();
    songTest.meta.author = faker.music.artist();
    songTest.meta.description = faker.lorem.sentence();
    songTest.meta.name = faker.music.songName();
    songTest.meta.originalAuthor = faker.music.artist();

    songTest.tempo = faker.helpers.rangeToNumber({ min: 20 * 1, max: 20 * 4 });
    const layerCount = faker.helpers.rangeToNumber({ min: 1, max: 5 });

    for (let layerIndex = 0; layerIndex < layerCount; layerIndex++) {
      const instrument = Instrument.builtIn[layerCount];
      const layer = songTest.createLayer();
      layer.meta.name = instrument.meta.name;

      const notes = Array.from({
        length: faker.helpers.rangeToNumber({ min: 20, max: 120 }),
      }).map(
        () =>
          new Note(instrument, {
            key: faker.helpers.rangeToNumber({ min: 0, max: 127 }),
            velocity: faker.helpers.rangeToNumber({ min: 0, max: 127 }),
            panning: faker.helpers.rangeToNumber({ min: -1, max: 1 }),
            pitch: faker.helpers.rangeToNumber({ min: -1, max: 1 }),
          }),
      );

      for (let i = 0; i < notes.length; i++)
        songTest.setNote(i * 4, layer, notes[i]);
      // "i * 4" is placeholder - this is the tick to place on
    }

    this.logger.log(
      `Generated song with ${layerCount} layers, ${songTest.length} ticks`,
    );

    return songTest;
  }

  private generateRandomDate(from: Date, to: Date): Date {
    return new Date(
      faker.date.between({
        from: from.getTime(),
        to: to.getTime(),
      }),
    );
  }
}
