import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import { User } from '../../models/user';
import { Message } from '../../models/message';

export const handleChatMessage = async (
  io: Server,
  data: { roomId: string; userId: string; message: string }
) => {
  const { roomId, userId, message } = data;

  const user = await User.findById(userId);

  if (user) {
    const newMessage = new Message({
      nickname: user.nickname,
      message,
      userId: new mongoose.Types.ObjectId(userId),
      roomId: new mongoose.Types.ObjectId(roomId),
    });

    await newMessage.save();

    console.log('Sending message to room:', roomId, newMessage);
    io.to(roomId).emit('chat message', newMessage);
  }
};
