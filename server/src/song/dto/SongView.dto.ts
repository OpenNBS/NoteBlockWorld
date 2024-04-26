import { SongDocument } from '../entity/song.entity';

type SongViewUploader = {
  username: string;
  profileImage: string;
};

export class SongViewDto {
  id: string;
  createdAt: Date;
  editedAt: Date;
  uploader: SongViewUploader;
  playCount: number;
  downloadCount: number;
  likeCount: number;
  allowDownload: boolean;
  visibility: string;

  // SONG ATTRIBUTES
  title: string;
  originalAuthor: string;
  description: string;
  duration: number;
  tempo: number;
  noteCount: number;
  thumbnailUrl: string;
  nbsFileUrl: string;
  category: string;
  vanillaInstrumentCount: number;
  customInstrumentCount: number;
  layerCount: number;
  midiFileName: string;

  public static fromSongDocument(song: SongDocument): SongViewDto {
    const data = song.toJSON();
    return new SongViewDto({
      ...data,
      uploader: song.uploader as unknown as SongViewUploader,
    });
  }

  constructor(song: Partial<SongViewDto>) {
    Object.assign(this, song);
  }
}
