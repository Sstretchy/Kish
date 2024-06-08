import mongoose, { Schema, Document } from 'mongoose';

export interface IGameSession extends Document {
  roomId: mongoose.Types.ObjectId;
  tokens: {
    userId: mongoose.Types.ObjectId;
    color: string;
    nickName: string;
    location: string;
  }[];
}

const GameSessionSchema: Schema = new Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  tokens: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      color: String,
      nickName: String,
      location: String,
    },
  ],
});

export const GameSession = mongoose.model<IGameSession>(
  'GameSession',
  GameSessionSchema
);
