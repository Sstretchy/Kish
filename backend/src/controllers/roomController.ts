import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Room } from '../models/room';

export const createRoom = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const newRoom = new Room({
      roomId: new mongoose.Types.ObjectId().toString(),
      players: [new mongoose.Types.ObjectId(userId)]
    });
    await newRoom.save();

    res.status(200).json({ success: true, roomId: newRoom.roomId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
