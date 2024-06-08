"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const rooms_1 = require("./rooms");
const messages_1 = require("./messages");
const tokens_1 = require("./tokens");
const initSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: 'http://localhost:8080',
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        console.log(`New connection: ${socket.id}`);
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
        // Присоединение к комнате
        socket.on('join room', (data) => (0, rooms_1.handleJoinRoom)(socket, io, data));
        // Обработка сообщений в комнате
        socket.on('chat message', (data) => (0, messages_1.handleChatMessage)(io, data));
        // Обработка токенов
        socket.on('place token', (data) => (0, tokens_1.handlePlaceToken)(socket, io, data));
    });
};
exports.initSocket = initSocket;
