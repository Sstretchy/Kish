"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const message_1 = require("../models/message");
const user_1 = require("../models/user");
const room_1 = require("../models/room");
const gameSession_1 = require("../models/gameSession");
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
        socket.on('join room', ({ roomId, userId }) => __awaiter(void 0, void 0, void 0, function* () {
            socket.join(roomId);
            const room = yield room_1.Room.findById(roomId);
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
            if (room &&
                !room.players.some((player) => player.equals(userObjectId)) &&
                room.players.length < 4) {
                room.players.push(userObjectId);
                yield room.save();
                socket.to(roomId).emit('user joined', { userId });
            }
            // Load existing tokens and send to the user
            const gameSession = yield gameSession_1.GameSession.findOne({
                roomId: new mongoose_1.default.Types.ObjectId(roomId),
            });
            if (gameSession) {
                socket.emit('load tokens', gameSession.tokens);
            }
        }));
        // Обработка сообщений в комнате
        socket.on('chat message', ({ roomId, userId, message }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield user_1.User.findById(userId);
            if (user) {
                const newMessage = new message_1.Message({
                    username: user.nickname,
                    message,
                    userId: new mongoose_1.default.Types.ObjectId(userId),
                    roomId: new mongoose_1.default.Types.ObjectId(roomId),
                });
                yield newMessage.save();
                console.log('Sending message to room:', roomId, newMessage);
                io.to(roomId).emit('chat message', newMessage);
            }
        }));
        // Обработка токенов
        socket.on('place token', ({ roomId, token }) => __awaiter(void 0, void 0, void 0, function* () {
            const gameSession = yield gameSession_1.GameSession.findOne({
                roomId: new mongoose_1.default.Types.ObjectId(roomId),
            });
            const tokenObjectId = new mongoose_1.default.Types.ObjectId(token.userId);
            if (gameSession) {
                const updatedTokens = [
                    ...gameSession.tokens.filter((t) => !t.userId.equals(tokenObjectId)),
                    Object.assign(Object.assign({}, token), { userId: tokenObjectId }),
                ];
                gameSession.tokens = updatedTokens;
                io.to(roomId).emit('update tokens', updatedTokens);
                yield gameSession.save();
                socket.emit('load tokens', gameSession.tokens);
            }
        }));
    });
};
exports.initSocket = initSocket;
