import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import { GameSession } from '../../models/gameSession';

export const handlePlaceToken = async (
  socket: Socket,
  io: Server,
  data: {
    roomId: string;
    token: {
      userId: string;
      color: string;
      nickName: string;
      location: string;
    };
  }
) => {
  const { roomId, token } = data;

  const gameSession = await GameSession.findOne({
    roomId: new mongoose.Types.ObjectId(roomId),
  });

  const tokenUserObjectId = new mongoose.Types.ObjectId(token.userId);

  if (gameSession) {
    const updatedTokens = [
      ...gameSession.tokens.filter((t) => !t.userId.equals(tokenUserObjectId)),
      { ...token, userId: tokenUserObjectId },
    ];
    gameSession.tokens = updatedTokens;
    await gameSession.save();
    io.to(roomId).emit('update tokens', updatedTokens);
    socket.emit('load tokens', gameSession.tokens);
  }
};
