import { SongPreviewDto } from './SongPreview.dto';

export class FeaturedSongsDto {
  hour : SongPreviewDto[];
  day  : SongPreviewDto[];
  week : SongPreviewDto[];
  month: SongPreviewDto[];
  year : SongPreviewDto[];
  all  : SongPreviewDto[];

  public static create(): FeaturedSongsDto {
    return {
      hour : [],
      day  : [],
      week : [],
      month: [],
      year : [],
      all  : []
    };
  }
}
