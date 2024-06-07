import mongoose, { Schema, Document } from 'mongoose';

export interface IToken {
  x: number;
  y: number;
  userId: mongoose.Types.ObjectId;
  color: string;
  nickName: string;
  location: string;
}

export interface IGameSession extends Document {
  roomId: mongoose.Types.ObjectId;
  tokens: IToken[];
}

const TokenSchema: Schema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  userId: { type: mongoose.Types.ObjectId, required: true },
  color: { type: String, required: true },
  nickName: { type: String, required: true },
  location: { type: String, required: true },
});

const GameSessionSchema: Schema = new Schema({
  roomId: { type: mongoose.Types.ObjectId, required: true, unique: true },
  tokens: { type: [TokenSchema], default: [] },
});

export const GameSession = mongoose.model<IGameSession>('GameSession', GameSessionSchema);
