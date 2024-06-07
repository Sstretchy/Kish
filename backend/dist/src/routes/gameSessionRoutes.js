"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gameSessionController_1 = require("../controllers/gameSessionController");
const router = express_1.default.Router();
router.post('/create', gameSessionController_1.createGameSession);
// router.get('/:roomId', getGameSession);
// router.put('/update', updateGameSession);
exports.default = router;
