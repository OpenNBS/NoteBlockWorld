import { customAlphabet } from 'nanoid';

import { UPLOAD_CONSTANTS } from '@nbw/config';
import { Song as SongEntity, SongWithUser } from '@nbw/database';
import type {
  SongPreviewDto,
  VisibilityType,
  SongViewDto,
  UploadSongDto,
  UploadSongResponseDto,
} from '@nbw/validation';

export const formatDuration = (totalSeconds: number) => {
  const minutes = Math.floor(Math.ceil(totalSeconds) / 60);
  const seconds = Math.ceil(totalSeconds) % 60;

  return `${minutes.toFixed().padStart(1, '0')}:${seconds
    .toFixed()
    .padStart(2, '0')}`;
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

export function uploadSongResponseDtoFromSongWithUser(
  song: SongWithUser,
): UploadSongResponseDto {
  const uploaderDoc = song.uploader as SongWithUser['uploader'] & {
    _id?: { toString(): string };
  };
  const uploaderId = uploaderDoc._id?.toString() ?? '';

  return {
    publicId: song.publicId,
    title: song.title,
    uploader: {
      id: uploaderId,
      username: song.uploader.username,
      profileImage: song.uploader.profileImage,
    },
    thumbnailUrl: song.thumbnailUrl,
    duration: song.stats.duration,
    noteCount: song.stats.noteCount,
  };
}

export function songViewDtoFromSongDocument(song: SongWithUser): SongViewDto {
  const uploaderDoc = song.uploader as SongWithUser['uploader'] & {
    _id?: { toString(): string };
  };
  const uploaderId = uploaderDoc._id?.toString() ?? '';

  return {
    publicId: song.publicId,
    createdAt: song.createdAt,
    uploader: {
      id: uploaderId,
      username: song.uploader.username,
      profileImage: song.uploader.profileImage,
    },
    thumbnailUrl: song.thumbnailUrl,
    playCount: song.playCount,
    downloadCount: song.downloadCount,
    likeCount: song.likeCount,
    allowDownload: song.allowDownload,
    title: song.title,
    originalAuthor: song.originalAuthor,
    description: song.description,
    visibility: song.visibility,
    category: song.category,
    license: song.license,
    customInstruments: song.customInstruments,
    fileSize: song.fileSize,
    stats: song.stats,
  };
}

export function uploadSongDtoFromSongDocument(song: SongEntity): UploadSongDto {
  return {
    file: undefined as unknown as Express.Multer.File,
    allowDownload: song.allowDownload,
    visibility: song.visibility,
    title: song.title,
    originalAuthor: song.originalAuthor,
    description: song.description,
    category: song.category,
    thumbnailData: song.thumbnailData,
    license: song.license,
    customInstruments: song.customInstruments,
  } as UploadSongDto;
}

export function songPreviewFromSongDocumentWithUser(
  song: SongPreviewSource,
): SongPreviewDto {
  return {
    publicId: song.publicId,
    uploader: {
      username: song.uploader.username,
      profileImage: song.uploader.profileImage,
    },
    title: song.title,
    description: song.description ?? '',
    originalAuthor: song.originalAuthor ?? '',
    duration: song.stats.duration,
    noteCount: song.stats.noteCount,
    thumbnailUrl: song.thumbnailUrl,
    createdAt: song.createdAt,
    updatedAt: song.updatedAt,
    playCount: song.playCount,
    visibility: song.visibility,
  };
}

export type SongPreviewSource = {
  publicId: string;
  uploader: {
    username: string;
    profileImage: string;
  };
  title: string;
  description: string;
  originalAuthor: string;
  stats: {
    duration: number;
    noteCount: number;
  };
  thumbnailUrl: string;
  createdAt: Date;
  updatedAt: Date;
  playCount: number;
  visibility: VisibilityType;
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
      value: UPLOAD_CONSTANTS.categories[category],
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
          text: UPLOAD_CONSTANTS.licenses[license]
            ? UPLOAD_CONSTANTS.licenses[license].shortName
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
