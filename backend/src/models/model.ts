import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  auth0Id: string;
  nickname?: string;
}

export interface IMessage extends Document {
  username: string;
  message: string;
  userId: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  auth0Id: { type: String, required: true, unique: true },
  nickname: { type: String, required: false }
});

const MessageSchema: Schema = new Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export const User = mongoose.model<IUser>('User', UserSchema);
export const Message = mongoose.model<IMessage>('Message', MessageSchema);
