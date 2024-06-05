import { Request, Response } from 'express';
import { User } from '../models/model';

export const registerUser = async (req: Request, res: Response) => {
  const { email, name, auth0Id, nickname } = req.body;

  try {
    let user = await User.findOne({ auth0Id });

    if (!user) {
      user = new User({
        email,
        name,
        auth0Id,
        nickname: nickname || 'Anonymous',
      });
      await user.save();
    }

    res
      .status(200)
      .json({ success: true, userId: user._id, nickName: user.nickname });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateNickname = async (req: Request, res: Response) => {
  const { userId, nickName } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    user.nickname = nickName;
    await user.save();

    res.status(200).json({ success: true, nickName: user.nickname });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
