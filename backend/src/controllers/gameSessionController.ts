import { Request, Response } from 'express';
import { GameSession } from '../models/gameSession';

export const createGameSession = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.body;
    const gameSession = new GameSession({ roomId, tokens: [] });
    await gameSession.save();
    res.status(201).json({ success: true, gameSession });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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
