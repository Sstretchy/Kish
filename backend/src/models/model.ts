import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  auth0Id: string;
  nickname: string;
}

export interface IRoom extends Document {
  roomId: string;
  players: mongoose.Types.ObjectId[];
}

export interface IMessage extends Document {
  username: string;
  message: string;
  userId: mongoose.Types.ObjectId;
  roomId: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  auth0Id: { type: String, required: true, unique: true },
  nickname: { type: String, required: false }
});

const RoomSchema: Schema = new Schema({
  roomId: { type: String, required: true, unique: true },
  players: [{ type: mongoose.Types.ObjectId, ref: 'User' }]
});

const MessageSchema: Schema = new Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: String, required: true }
});

export const User = mongoose.model<IUser>('User', UserSchema);
export const Room = mongoose.model<IRoom>('Room', RoomSchema);
export const Message = mongoose.model<IMessage>('Message', MessageSchema);
