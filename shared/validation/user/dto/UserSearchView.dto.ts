import { UserDocument } from '@server/user/entity/user.entity';

export class UserSearchViewDto {
  id: string;
  username: string;
  profileImage: string;
  songCount: number;
  createdAt: Date;
  updatedAt: Date;

  static fromUserDocument(
    doc: UserDocument & { songCount: number },
  ): UserSearchViewDto {
    return {
      id: doc.publicName,
      username: doc.publicName,
      profileImage: doc.profileImage,
      songCount: doc.songCount,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
