import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Message, User } from './src/models/model';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8080', // Укажите домен вашего клиента
  methods: ['GET', 'POST']
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

// API для регистрации пользователей
app.post('/api/register', async (req, res) => {
  const { email, name, auth0Id, nickname } = req.body;

  try {
    let user = await User.findOne({ auth0Id });

    if (!user) {
      user = new User({
        email,
        name,
        auth0Id,
        nickname
      });
      await user.save();
    }

    res.status(200).json({ success: true, userId: user._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// API для отправки сообщений
app.post('/api/messages', async (req, res) => {
  const { userId, message } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newMessage = new Message({
      username: user.nickname,
      message,
      userId
    });

    await newMessage.save();
    res.status(200).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// API для получения всех сообщений
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Привет, мир!');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порте ${PORT}`);
});
