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
exports.createRoom = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const room_1 = require("../models/room");
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const newRoom = new room_1.Room({
            roomId: new mongoose_1.default.Types.ObjectId().toString(),
            players: [new mongoose_1.default.Types.ObjectId(userId)]
        });
        yield newRoom.save();
        res.status(200).json({ success: true, roomId: newRoom.roomId });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.createRoom = createRoom;
