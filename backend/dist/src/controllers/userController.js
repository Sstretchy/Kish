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
exports.updateNickname = exports.registerUser = void 0;
const model_1 = require("../models/model");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, auth0Id, nickname } = req.body;
    try {
        let user = yield model_1.User.findOne({ auth0Id });
        if (!user) {
            user = new model_1.User({
                email,
                name,
                auth0Id,
                nickname: nickname || 'Anonymous',
            });
            yield user.save();
        }
        res
            .status(200)
            .json({ success: true, userId: user._id, nickName: user.nickname });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.registerUser = registerUser;
const updateNickname = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, nickName } = req.body;
    try {
        const user = yield model_1.User.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: 'User not found' });
        }
        user.nickname = nickName;
        yield user.save();
        res.status(200).json({ success: true, nickName: user.nickname });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.updateNickname = updateNickname;
