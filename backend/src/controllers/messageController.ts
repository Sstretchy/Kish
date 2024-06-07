import { Request, Response } from 'express';
import { Message } from '../models/message';
import { User } from '../models/user';

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  const { userId, message, roomId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newMessage = new Message({
      username: user.nickname,
      message,
      userId,
      roomId
    });

    await newMessage.save();
    res.status(200).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
