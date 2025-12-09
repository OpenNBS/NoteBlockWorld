import { Instrument, Note, Song } from '@encode42/nbs.js';
import { faker } from '@faker-js/faker';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { UPLOAD_CONSTANTS } from '@nbw/config';
import {
  CategoryType,
  LicenseType,
  SongDocument,
  UploadSongDto,
  UserDocument,
  VisibilityType,
} from '@nbw/database';
import { SongService } from '@server/song/song.service';
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
      const user = await this.userService.createWithEmail(
        faker.internet.email(),
      );

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
    const licenses = Object.keys(UPLOAD_CONSTANTS.licenses);
    const categories = Object.keys(UPLOAD_CONSTANTS.categories);
    const visibilities = Object.keys(UPLOAD_CONSTANTS.visibility);

    for (const user of users) {
      // most users will have 0-5 songs and a few will have 5-10, not a real statist by whatever I just what to test the system in development mode
      const songCount = this.generateExponentialRandom(5, 2, 0.5, 10);

      for (let i = 0; i < songCount; i++) {
        const nbsSong = this.generateRandomSong();
        const fileData = nbsSong.toArrayBuffer();
        const fileBuffer = Buffer.from(fileData);

        const body: UploadSongDto = {
          file: {
            buffer: fileBuffer,
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
            backgroundColor: faker.color.rgb({ format: 'hex' }),
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

    // Tempo: 60-120 BPM (20 * 3 to 20 * 6)
    songTest.tempo = faker.helpers.rangeToNumber({ min: 20 * 3, max: 20 * 6 });

    // Choose scale type (blues or phrygian)
    const useBluesScale = faker.datatype.boolean();
    const scaleType = useBluesScale ? 'blues' : 'phrygian';

    // Choose root note (C to B, octave 3-5)
    const rootOctave = faker.helpers.rangeToNumber({ min: 3, max: 5 });
    const rootNote = faker.helpers.rangeToNumber({ min: 0, max: 11 }); // 0=C, 1=C#, etc.
    const rootKey = rootNote + rootOctave * 12;

    // Define scales (in semitones from root)
    const bluesScale = [0, 3, 5, 6, 7, 10]; // 1, b3, 4, b5, 5, b7
    const phrygianScale = [0, 1, 3, 5, 7, 8, 10]; // 1, b2, b3, 4, 5, b6, b7
    const scale = useBluesScale ? bluesScale : phrygianScale;

    // Song length in ticks (4 ticks per beat, 8-16 bars)
    const bars = faker.helpers.rangeToNumber({ min: 8, max: 16 });
    const beatsPerBar = 4;
    const ticksPerBeat = 4;
    const totalTicks = bars * beatsPerBar * ticksPerBeat;

    // Get instruments for bass and melody
    const bassInstrument = Instrument.builtIn[0]; // Lower instrument
    const melodyInstrument =
      Instrument.builtIn[faker.helpers.rangeToNumber({ min: 1, max: 4 })];

    // Create bass layer
    const bassLayer = songTest.createLayer();
    bassLayer.meta.name = 'Bass';

    // Create melody layer
    const melodyLayer = songTest.createLayer();
    melodyLayer.meta.name = 'Melody';

    // Generate bass line (root notes and fifths, simpler rhythm)
    const bassNotes: Array<{ tick: number; key: number }> = [];
    const bassTickInterval = ticksPerBeat * 2; // Every 2 beats

    for (let tick = 0; tick < totalTicks; tick += bassTickInterval) {
      // Sometimes skip a beat for variation
      if (faker.datatype.boolean({ probability: 0.2 })) continue;

      // Choose between root, fifth, or octave
      const bassChoice = faker.helpers.arrayElement([0, 7, 12]); // root, fifth, octave
      const bassKey = rootKey + bassChoice;

      // Keep in valid range (24-60 is a good bass range)
      if (bassKey >= 24 && bassKey <= 60) {
        bassNotes.push({ tick, key: bassKey });
      }
    }

    // Add some passing notes for more interest
    for (let i = 0; i < bassNotes.length - 1; i++) {
      if (faker.datatype.boolean({ probability: 0.3 })) {
        const currentTick = bassNotes[i].tick;
        const nextTick = bassNotes[i + 1].tick;
        const midTick = currentTick + (nextTick - currentTick) / 2;
        const passingNote = rootKey + faker.helpers.arrayElement([2, 4, 5]); // Minor third, fourth, or tritone
        if (passingNote >= 24 && passingNote <= 60) {
          bassNotes.push({ tick: midTick, key: passingNote });
        }
      }
    }

    // Sort bass notes by tick
    bassNotes.sort((a, b) => a.tick - b.tick);

    // Generate melody (scale notes, more varied rhythm)
    const melodyNotes: Array<{ tick: number; key: number }> = [];
    const melodyOctave = rootOctave + 1; // One octave higher than root
    const melodyRootKey = rootNote + melodyOctave * 12;

    // Create melodic phrases
    const phraseLength = beatsPerBar * ticksPerBeat * 2; // 2 bars per phrase
    for (
      let phraseStart = 0;
      phraseStart < totalTicks;
      phraseStart += phraseLength
    ) {
      const phraseEnd = Math.min(phraseStart + phraseLength, totalTicks);

      // Generate notes in this phrase
      let currentTick = phraseStart;
      while (currentTick < phraseEnd) {
        // Vary note lengths (quarter, eighth, dotted quarter)
        const noteLengths = [
          ticksPerBeat,
          ticksPerBeat / 2,
          ticksPerBeat * 1.5,
        ];
        const noteLength = faker.helpers.arrayElement(noteLengths);

        if (currentTick + noteLength > phraseEnd) break;

        // Choose scale note
        const scaleDegree = faker.helpers.arrayElement(scale);
        const melodyKey = melodyRootKey + scaleDegree;

        // Keep in valid range (48-84 is a good melody range)
        if (melodyKey >= 48 && melodyKey <= 84) {
          melodyNotes.push({ tick: currentTick, key: melodyKey });
        }

        // Sometimes add a rest
        if (faker.datatype.boolean({ probability: 0.2 })) {
          currentTick += noteLength * 0.5;
        } else {
          currentTick += noteLength;
        }
      }
    }

    // Add bass notes to song
    for (const { tick, key } of bassNotes) {
      const note = new Note(bassInstrument, {
        key,
        velocity: faker.helpers.rangeToNumber({ min: 80, max: 100 }), // Strong bass
        panning: 0,
        pitch: 0,
      });
      songTest.setNote(tick, bassLayer, note);
    }

    // Add melody notes to song
    for (const { tick, key } of melodyNotes) {
      const note = new Note(melodyInstrument, {
        key,
        velocity: faker.helpers.rangeToNumber({ min: 70, max: 100 }),
        panning: faker.helpers.rangeToNumber({ min: -0.3, max: 0.3 }), // Slight panning variation
        pitch: 0,
      });
      songTest.setNote(tick, melodyLayer, note);
    }

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
