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
exports.handleChatMessage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("../../models/user");
const message_1 = require("../../models/message");
const handleChatMessage = (socket, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, userId, message } = data;
    const user = yield user_1.User.findById(userId);
    if (user) {
        const newMessage = new message_1.Message({
            username: user.nickname,
            message,
            userId: new mongoose_1.default.Types.ObjectId(userId),
            roomId: new mongoose_1.default.Types.ObjectId(roomId),
        });
        yield newMessage.save();
        console.log(roomId, 'check');
        console.log('Sending message to room:', roomId, newMessage);
        socket.to(roomId).emit('chat message', newMessage);
    }
});
exports.handleChatMessage = handleChatMessage;
