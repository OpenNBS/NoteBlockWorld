import { SongDocument } from '../entity/song.entity';

export class SongViewDto {
  id: string;
  createdAt: Date;
  editedAt: Date;
  uploader: string;
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
    return new SongViewDto({ ...data });
  }

  constructor(song: Partial<SongDocument>) {
    Object.assign(this, song);
  }
}
