import mongoose, { Schema, Document } from 'mongoose';

const RoomSchema: Schema = new Schema({
  roomId: { type: String, required: true, unique: true },
  players: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  gameSession: { type: mongoose.Schema.Types.ObjectId, ref: 'GameSession' },
});

export interface IRoom extends Document {
  roomId: string;
  players: mongoose.Types.ObjectId[];
  gameSession: mongoose.Types.ObjectId;
}

export const Room = mongoose.model<IRoom>('Room', RoomSchema);
