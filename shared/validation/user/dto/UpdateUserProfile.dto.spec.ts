import { validate } from 'class-validator';
import { UserLinks } from './UpdateUserProfile.dto';

describe('UpdateUserProfileDto', () => {
  describe('UserLinks', () => {
    it('should validate valid URLs', async () => {
      const userLinks = new UserLinks();

      userLinks.github = 'https://github.com/tomast1337';
      userLinks.youtube = 'https://www.youtube.com/@Bentroen_';

      userLinks.spotify =
        'https://open.spotify.com/artist/1McMsnEElThX1knmY4oliG?si=v95i3XbRRgKT9JwyiFiFEg';

      userLinks.bandcamp = 'https://igorrr.bandcamp.com/';
      userLinks.facebook = 'https://www.facebook.com/MrBean';
      userLinks.reddit = 'https://www.reddit.com/user/Unidan/';
      userLinks.soundcloud = 'https://soundcloud.com/futureisnow';
      userLinks.steam = 'https://steamcommunity.com/id/CattleDecapitation/';
      userLinks.x = 'https://x.com/Trail_Cams';
      userLinks.twitch = 'https://www.twitch.tv/vinesauce';
      userLinks.threads = 'https://www.threads.net/@kimkardashian';
      userLinks.tiktok = 'https://www.tiktok.com/@karolg';
      userLinks.snapchat = 'https://www.snapchat.com/add/username';
      userLinks.instagram = 'https://instagram.com/validuser';
      userLinks.discord = 'https://discord.com/validuser';
      userLinks.telegram = 'https://t.me/validuser';

      const errors = await validate(userLinks);
      console.log(errors);
      expect(errors.length).toBe(0);
    });

    it('should invalidate invalid URLs', async () => {
      const userLinks = new UserLinks();
      userLinks.bandcamp = 'invalid-url';
      userLinks.discord = 'invalid-url';
      userLinks.facebook = 'invalid-url';
      userLinks.github = 'invalid-url';
      userLinks.instagram = 'invalid-url';
      userLinks.reddit = 'invalid-url';
      userLinks.snapchat = 'invalid-url';
      userLinks.soundcloud = 'invalid-url';
      userLinks.spotify = 'invalid-url';
      userLinks.steam = 'invalid-url';
      userLinks.telegram = 'invalid-url';
      userLinks.tiktok = 'invalid-url';
      userLinks.threads = 'invalid-url';
      userLinks.twitch = 'invalid-url';
      userLinks.x = 'invalid-url';
      userLinks.youtube = 'invalid-url';

      const errors = await validate(userLinks);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should allow optional fields to be empty', async () => {
      const userLinks = new UserLinks();

      const errors = await validate(userLinks);
      expect(errors.length).toBe(0);
    });
  });
});
