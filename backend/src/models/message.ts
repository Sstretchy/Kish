import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  nickname: string;
  message: string;
  userId: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
}

const MessageSchema: Schema = new Schema({
  nickname: { type: String, required: true },
  message: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true }
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema);