import express = require('express');
import cors = require('cors');
import { Request, Response } from 'express';
import { createServer } from 'http';
import { initSocket } from './src/sockets';


const app = express();
const PORT = process.env.PORT || 3001;

const server = createServer(app);
initSocket(server);

app.use(cors({
  origin: 'http://localhost:8080', // Укажите домен вашего клиента
  methods: ['GET', 'POST']
}));

app.get('/', (req: Request, res: Response) => {
  res.send('Привет, мир!');
});

server.listen(PORT, () => {
  console.log(`Сервер запущен на порте ${PORT}`);
});

