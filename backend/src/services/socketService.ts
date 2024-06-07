import { Server as SocketIOServer, Socket } from 'socket.io';
import mongoose from 'mongoose';
import { IMessage, Message } from '../models/message';
import { User } from '../models/user';
import { Room } from '../models/room';
import { GameSession, IGameSession } from '../models/gameSession';

interface ServerToClientEvents {
  'chat message': (msg: IMessage) => void;
  'user joined': (data: { userId: string }) => void;
  'load tokens': (tokens: IGameSession['tokens']) => void;
  'update tokens': (tokens: IGameSession['tokens']) => void;
}

interface ClientToServerEvents {
  'join room': (data: { roomId: string; userId: string }) => void;
  'chat message': (data: {
    roomId: string;
    userId: string;
    message: string;
  }) => void;
  'place token': (data: {
    roomId: string;
    token: { x: number; y: number; userId: string; color: string; nickName: string; location: string };
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

        // Load existing tokens and send to the user
        const gameSession = await GameSession.findOne({ roomId: new mongoose.Types.ObjectId(roomId) });
        if (gameSession) {
          socket.emit('load tokens', gameSession.tokens);
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
            roomId: new mongoose.Types.ObjectId(roomId),
          });
          await newMessage.save();
          console.log('Sending message to room:', roomId, newMessage);
          io.to(roomId).emit('chat message', newMessage);
        }
      });

      // Обработка токенов
      socket.on('place token', async ({ roomId, token }) => {
        const gameSession = await GameSession.findOne({ roomId: new mongoose.Types.ObjectId(roomId) });
        const tokenObjectId = new mongoose.Types.ObjectId(token.userId);
        if (gameSession) {
          const updatedTokens = [...gameSession.tokens.filter(t => !t.userId.equals(tokenObjectId)), { ...token, userId: tokenObjectId }];
          gameSession.tokens = updatedTokens;
          io.to(roomId).emit('update tokens', updatedTokens);
          await gameSession.save();
          socket.emit('load tokens', gameSession.tokens);
        }
      });
    }
  );
};
