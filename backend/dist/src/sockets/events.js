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
exports.registerSocketEvents = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const model_1 = require("../models/model");
function registerSocketEvents(io) {
    io.on('connection', (socket) => {
        console.log(`New connection: ${socket.id}`);
        console.log('A user connected');
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
        // Обмен сообщениями
        socket.on('set username', (username) => {
            console.log(username);
            socket.data.username = username; // Сохраняем имя пользователя в сокете
        });
        socket.on('chat message', (message) => {
            const username = socket.data.username || 'Anonymous';
            io.emit('chat message', { username, message, userId: socket.id }); // Отправляем сообщение с именем пользователя
        });
        // Регистрация пользователя
        socket.on('register', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Найдите пользователя по Auth0 ID
                let user = yield model_1.User.findOne({ auth0Id: data.auth0Id });
                if (!user) {
                    // Если пользователь не найден, создайте нового пользователя
                    user = new model_1.User({
                        email: data.email,
                        name: data.name,
                        auth0Id: data.auth0Id,
                    });
                    yield user.save();
                }
                socket.emit('register', { success: true, userId: user._id });
            }
            catch (error) {
                socket.emit('register', { success: false, message: error.message });
            }
        }));
        // Создание новой комнаты
        socket.on('create-room', (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const room = new model_1.Room({
                    roomId: new mongoose_1.default.Types.ObjectId().toString(),
                    players: [userId],
                });
                yield room.save();
                socket.emit('create-room', { success: true, roomId: room.roomId });
            }
            catch (error) {
                socket.emit('create-room', { success: false, message: error.message });
            }
        }));
        // Присоединение к комнате
        socket.on('join-room', ({ userId, roomId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const room = yield model_1.Room.findOne({ roomId });
                if (room && room.players.length < 4) {
                    room.players.push(userId);
                    yield room.save();
                    socket.emit('join-room', { success: true, roomId: room.roomId });
                }
                else {
                    socket.emit('join-room', {
                        success: false,
                        message: 'Room is full or does not exist',
                    });
                }
            }
            catch (error) {
                socket.emit('join-room', { success: false, message: error.message });
            }
        }));
    });
}
exports.registerSocketEvents = registerSocketEvents;
