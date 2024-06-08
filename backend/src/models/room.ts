import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  players: mongoose.Types.ObjectId[];
}

const RoomSchema: Schema = new Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});


export const Room = mongoose.model<IRoom>('Room', RoomSchema);
