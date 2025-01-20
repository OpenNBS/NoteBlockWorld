export class UserViewDto {
  username: string;
  profileImage: string;
  constructor(partial: UserViewDto) {
    Object.assign(this, partial);
  }
}
