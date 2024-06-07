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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = exports.getMessages = void 0;
const message_1 = require("../models/message");
const user_1 = require("../models/user");
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.params;
        const messages = yield message_1.Message.find({ roomId });
        res.status(200).json({ success: true, messages });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getMessages = getMessages;
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, message, roomId } = req.body;
    try {
        const user = yield user_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const newMessage = new message_1.Message({
            username: user.nickname,
            message,
            userId,
            roomId
        });
        yield newMessage.save();
        res.status(200).json({ success: true, message: newMessage });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.createMessage = createMessage;
