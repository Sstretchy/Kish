import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import { Room } from '../../models/room';
import { GameSession } from '../../models/gameSession';
import { User } from '../../models/user';

export const handleJoinRoom = async (
  socket: Socket,
  io: Server,
  data: { roomId: string; userId: string; nickName: string }
) => {
  const { roomId, userId } = data;

  socket.join(roomId);
  
  const room = await Room.findById(roomId);
  const user = await User.findById(userId);

  const userObjectId = new mongoose.Types.ObjectId(userId);
  io.to(roomId).emit('user joined', user.nickname);

  if (
    room &&
    !room.players.some((player) => player.equals(userObjectId)) &&
    room.players.length < 4
  ) {
    room.players.push(userObjectId);
    await room.save();
  }

  // Load existing tokens and send to the user
  const gameSession = await GameSession.findOne({
    roomId: new mongoose.Types.ObjectId(roomId),
  });
  if (gameSession) {
    socket.emit('load tokens', gameSession.tokens);
  }
};
