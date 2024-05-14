import { Server as SocketIOServer } from 'socket.io';
import * as http from 'http';
import { registerSocketEvents } from './events';

export function initSocket(server: http.Server) {
  const io = new SocketIOServer(server, {
    cors: {
        origin: "http://localhost:8080", // Разрешить запросы с фронтенда
        methods: ["GET", "POST"]
      }
  });

  registerSocketEvents(io);
}
