import { Socket } from 'socket.io';
import { Server as SocketIOServer } from 'socket.io';

export function registerSocketEvents(io: SocketIOServer): void {
  io.on('connection', (socket: Socket) => {
    console.log(`New connection: ${socket.id}`);
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  // Обмен сообщениями:

  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on('set username', (username) => {
      console.log(username);
      socket.data.username = username; // Сохраняем имя пользователя в сокете
    });

    socket.on('chat message', (message) => {
      const username = socket.data.username || 'Anonymous';
      io.emit('chat message', { username, message, userId: socket.id }); // Отправляем сообщение с именем пользователя
    });
  });

  // Пример работы с комнатами:
  //   io.on('connection', (socket: Socket) => {
  //     socket.on('join room', (room: string) => {
  //       socket.join(room);
  //     });

  //     socket.on('leave room', (room: string) => {
  //       socket.leave(room);
  //     });

  //     socket.on('send message to room', (room: string, message: string) => {
  //       io.to(room).emit('message', message);
  //     });
  //   });
}
