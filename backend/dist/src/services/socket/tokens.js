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
exports.handlePlaceToken = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const gameSession_1 = require("../../models/gameSession");
const handlePlaceToken = (socket, io, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, token } = data;
    const gameSession = yield gameSession_1.GameSession.findOne({
        roomId: new mongoose_1.default.Types.ObjectId(roomId),
    });
    const tokenUserObjectId = new mongoose_1.default.Types.ObjectId(token.userId);
    if (gameSession) {
        const updatedTokens = [
            ...gameSession.tokens.filter((t) => !t.userId.equals(tokenUserObjectId)),
            Object.assign(Object.assign({}, token), { userId: tokenUserObjectId }),
        ];
        gameSession.tokens = updatedTokens;
        yield gameSession.save();
        io.to(roomId).emit('update tokens', updatedTokens);
        socket.emit('load tokens', gameSession.tokens);
    }
});
exports.handlePlaceToken = handlePlaceToken;
