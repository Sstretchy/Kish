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
const http_1 = require("http");
const socketService_1 = require("./src/services/socketService");
const userRoutes_1 = __importDefault(require("./src/routes/userRoutes"));
const messageRoutes_1 = __importDefault(require("./src/routes/messageRoutes"));
const roomRoutes_1 = __importDefault(require("./src/routes/roomRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT']
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
const server = (0, http_1.createServer)(app);
(0, socketService_1.initSocket)(server);
app.use('/api/users', userRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
app.use('/api/rooms', roomRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Привет, мир!');
});
server.listen(PORT, () => {
    console.log(`Сервер запущен на порте ${PORT}`);
});
