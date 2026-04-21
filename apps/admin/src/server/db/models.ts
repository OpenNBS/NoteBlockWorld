import mongoose from 'mongoose';

import { Song, SongSchema, User, UserSchema } from '@nbw/database';

export function createDatabaseModels() {
  const songs =
    mongoose.models[Song.name] ?? mongoose.model(Song.name, SongSchema);

  const users =
    mongoose.models[User.name] ?? mongoose.model(User.name, UserSchema);

  return { songs, users };
}

export type DatabaseModels = ReturnType<typeof createDatabaseModels>;
