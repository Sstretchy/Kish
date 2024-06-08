import { Server as SocketIOServer, Socket } from 'socket.io';
import { IMessage } from '../../models/message';
import { IGameSession } from '../../models/gameSession';
import { handleJoinRoom } from './rooms';
import { handleChatMessage } from './messages';
import { handlePlaceToken } from './tokens';

interface ServerToClientEvents {
  'chat message': (msg: IMessage) => void;
  'user joined': (nickName: string ) => void;
  'load tokens': (tokens: IGameSession['tokens']) => void;
  'update tokens': (tokens: IGameSession['tokens']) => void;
}

interface ClientToServerEvents {
  'join room': (data: { roomId: string; userId: string, nickName: string }) => void;
  'chat message': (data: {
    roomId: string;
    userId: string;
    message: string;
  }) => void;
  'place token': (data: {
    roomId: string;
    token: {
      userId: string;
      color: string;
      nickName: string;
      location: string;
    };
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
      socket.on('join room', (data) => handleJoinRoom(socket, io, data));

      // Обработка сообщений в комнате
      socket.on('chat message', (data) => handleChatMessage(io, data));

      // Обработка токенов
      socket.on('place token', (data) => handlePlaceToken(socket, io, data));
    }
  );
};
