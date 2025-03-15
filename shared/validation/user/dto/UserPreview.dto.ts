export class UserPreviewDto {
  username: string;
  profileImage: string;

  constructor(partial: UserPreviewDto) {
    Object.assign(this, partial);
  }
}
