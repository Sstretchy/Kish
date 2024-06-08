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
exports.handleJoinRoom = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const room_1 = require("../../models/room");
const gameSession_1 = require("../../models/gameSession");
const user_1 = require("../../models/user");
const handleJoinRoom = (socket, io, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, userId } = data;
    socket.join(roomId);
    const room = yield room_1.Room.findById(roomId);
    const user = yield user_1.User.findById(userId);
    const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
    io.to(roomId).emit('user joined', user.nickname);
    if (room &&
        !room.players.some((player) => player.equals(userObjectId)) &&
        room.players.length < 4) {
        room.players.push(userObjectId);
        yield room.save();
    }
    // Load existing tokens and send to the user
    const gameSession = yield gameSession_1.GameSession.findOne({
        roomId: new mongoose_1.default.Types.ObjectId(roomId),
    });
    if (gameSession) {
        socket.emit('load tokens', gameSession.tokens);
    }
});
exports.handleJoinRoom = handleJoinRoom;
