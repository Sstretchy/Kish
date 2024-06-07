import express from 'express';
import {
  createGameSession,
//   getGameSession,
//   updateGameSession,
} from '../controllers/gameSessionController';

const router = express.Router();

router.post('/create', createGameSession);
// router.get('/:roomId', getGameSession);
// router.put('/update', updateGameSession);

export default router;
