import mongoose, { Schema, Document } from 'mongoose';

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    auth0Id: { type: String, required: true, unique: true },
    nickname: { type: String, required: false }
  });
  

export interface IUser extends Document {
  email: string;
  name: string;
  auth0Id: string;
  nickname: string;
}

export const User = mongoose.model<IUser>('User', UserSchema);