import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  username: string;
  message: string;
  userId: mongoose.Types.ObjectId;
  roomId: string;
}

const MessageSchema: Schema = new Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: String, required: true }
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema);