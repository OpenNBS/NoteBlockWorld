import mongoose from 'mongoose';

export async function connectDatabase(mongoUrl: string) {
  await mongoose.connect(mongoUrl);
}
