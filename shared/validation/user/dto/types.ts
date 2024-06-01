import { CreateUser } from './CreateUser.dto';
import { GetUser } from './GetUser.dto';
import { UserProfileDto } from './UserProfile.dto';

export type UserProfileDtoType = InstanceType<typeof UserProfileDto>;
export type GetUserType = InstanceType<typeof GetUser>;
export type CreateUserType = InstanceType<typeof CreateUser>;
