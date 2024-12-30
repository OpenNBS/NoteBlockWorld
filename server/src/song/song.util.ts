import { UploadConst } from '@shared/validation/song/constants';
import { customAlphabet } from 'nanoid';

import { SongWithUser } from './entity/song.entity';

// TODO: Move to shared
export const formatDuration = (totalSeconds: number) => {
  const minutes = Math.floor(Math.ceil(totalSeconds) / 60);
  const seconds = Math.ceil(totalSeconds) % 60;

  const formattedTime = `${minutes.toFixed().padStart(1, '0')}:${seconds
    .toFixed()
    .padStart(2, '0')}`;

  return formattedTime;
};

export function removeExtraSpaces(input: string): string {
  return input
    .replace(/ +/g, ' ') // replace multiple spaces with one space
    .replace(/\n\n+/g, '\n\n') // replace 3+ newlines with two newlines
    .trim(); // remove leading and trailing spaces
}

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const nanoid = customAlphabet(alphabet, 10);

export const generateSongId = () => {
  return nanoid();
};

export function getUploadDiscordEmbed({
  title,
  description,
  uploader,
  createdAt,
  publicId,
  thumbnailUrl,
  thumbnailData,
  originalAuthor,
  category,
  license,
  stats,
}: SongWithUser) {
  let fieldsArray = [];

  if (originalAuthor) {
    fieldsArray.push({
      name: 'Original Author',
      value: originalAuthor,
      inline: false,
    });
  }

  fieldsArray = fieldsArray.concat([
    {
      name: 'Category',
      value: UploadConst.categories[category],
      inline: true,
    },
    {
      name: 'Notes',
      value: stats.noteCount.toLocaleString('en-US'),
      inline: true,
    },
    {
      name: 'Length',
      value: formatDuration(stats.duration),
      inline: true,
    },
  ]);

  return {
    embeds: [
      {
        title: title,
        description: description,
        color: Number('0x' + thumbnailData.backgroundColor.replace('#', '')),
        timestamp: createdAt.toISOString(),
        footer: {
          text: UploadConst.licenses[license]
            ? UploadConst.licenses[license].shortName
            : 'Unknown License',
        },
        author: {
          name: uploader.username,
          icon_url: uploader.profileImage,
          //url: 'https://noteblock.world/user/${uploaderName}',
        },
        fields: fieldsArray,
        url: `https://noteblock.world/song/${publicId}`,
        image: {
          url: thumbnailUrl,
        },
        thumbnail: {
          url: 'https://noteblock.world/nbw-color.png',
        },
      },
    ],
  };
}
