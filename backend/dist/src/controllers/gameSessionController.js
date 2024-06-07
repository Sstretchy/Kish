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
exports.createGameSession = void 0;
const gameSession_1 = require("../models/gameSession");
const createGameSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.body;
        const gameSession = new gameSession_1.GameSession({ roomId, tokens: [] });
        yield gameSession.save();
        res.status(201).json({ success: true, gameSession });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.createGameSession = createGameSession;
// export const getGameSession = async (req: Request, res: Response) => {
//   try {
//     const { roomId } = req.params;
//     const gameSession = await GameSession.findOne({ roomId });
//     if (gameSession) {
//       res.status(200).json({ success: true, gameSession });
//     } else {
//       res.status(404).json({ success: false, message: 'Game session not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// export const updateGameSession = async (req: Request, res: Response) => {
//   try {
//     const { roomId, tokens } = req.body;
//     const gameSession = await GameSession.findOneAndUpdate({ roomId }, { tokens }, { new: true });
//     if (gameSession) {
//       res.status(200).json({ success: true, gameSession });
//     } else {
//       res.status(404).json({ success: false, message: 'Game session not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
