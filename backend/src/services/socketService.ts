import { Server as SocketIOServer, Socket } from 'socket.io';
import { IMessage, Message, Room, User } from '../models/model';
import mongoose from 'mongoose';

interface ServerToClientEvents {
  'chat message': (msg: IMessage) => void;
  'user joined': (data: { userId: string }) => void;
}

interface ClientToServerEvents {
  'join room': (data: { roomId: string; userId: string }) => void;
  'chat message': (data: {
    roomId: string;
    userId: string;
    message: string;
  }) => void;
}

export const initSocket = (server: any) => {
  const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(
    server,
    {
      cors: {
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST'],
      },
    }
  );

  io.on(
    'connection',
    (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
      console.log(`New connection: ${socket.id}`);

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });

      // Присоединение к комнате
      socket.on('join room', async ({ roomId, userId }) => {
        socket.join(roomId);
        const room = await Room.findById(roomId);
        const userObjectId = new mongoose.Types.ObjectId(userId);
        if (
          room &&
          !room.players.some((player) => player.equals(userObjectId)) &&
          room.players.length < 4
        ) {
          room.players.push(userObjectId);
          await room.save();
          socket.to(roomId).emit('user joined', { userId });
        }
      });

      // Обработка сообщений в комнате
      socket.on('chat message', async ({ roomId, userId, message }) => {
        const user = await User.findById(userId);
        if (user) {
          const newMessage = new Message({
            username: user.nickname,
            message,
            userId: new mongoose.Types.ObjectId(userId),
            roomId,
          });
          await newMessage.save();
          console.log('Sending message to room:', roomId, newMessage);
          io.to(roomId).emit('chat message', newMessage);
        }
      });
    }
  );
};
