import express from 'express';
import { registerUser, updateNickname } from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUser);
router.put('/nickname', updateNickname);

export default router;
