import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import userRoutes from './src/routes/userRoutes';
import messageRoutes from './src/routes/messageRoutes';
import roomRoutes from './src/routes/roomRoutes';
import gameSessionRoutes from './src/routes/gameSessionRoutes';
import { initSocket } from './src/services/socket/socket';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT']
}));

const connectWithRetry = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/kish', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

const server = createServer(app);
initSocket(server);

app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/game-sessions', gameSessionRoutes); 


app.get('/', (req, res) => {
  res.send('Привет, мир!');
});

server.listen(PORT, () => {
  console.log(`Сервер запущен на порте ${PORT}`);
});
