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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const model_1 = require("./src/sockets/models/model");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:8080', // Укажите домен вашего клиента
    methods: ['GET', 'POST']
}));
const connectWithRetry = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Attempting to connect to MongoDB...');
        yield mongoose_1.default.connect('mongodb://localhost:27017/kish', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    }
    catch (err) {
        console.error('MongoDB connection error:', err);
        setTimeout(connectWithRetry, 5000);
    }
});
connectWithRetry();
// API для регистрации пользователей
app.post('/api/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, auth0Id, nickname } = req.body;
    try {
        let user = yield model_1.User.findOne({ auth0Id });
        if (!user) {
            user = new model_1.User({
                email,
                name,
                auth0Id,
                nickname
            });
            yield user.save();
        }
        res.status(200).json({ success: true, userId: user._id });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
// API для отправки сообщений
app.post('/api/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, message } = req.body;
    try {
        const user = yield model_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const newMessage = new model_1.Message({
            username: user.nickname,
            message,
            userId
        });
        yield newMessage.save();
        res.status(200).json({ success: true, message: newMessage });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
// API для получения всех сообщений
app.get('/api/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield model_1.Message.find();
        res.status(200).json({ success: true, messages });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
app.get('/', (req, res) => {
    res.send('Привет, мир!');
});
app.listen(PORT, () => {
    console.log(`Сервер запущен на порте ${PORT}`);
});
