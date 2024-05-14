"use strict";
exports.__esModule = true;
exports.registerSocketEvents = void 0;
function registerSocketEvents(io) {
    io.on('connection', function (socket) {
        console.log("New connection: " + socket.id);
        console.log('A user connected');
        socket.on('disconnect', function () {
            console.log('User disconnected');
        });
    });
    // Обмен сообщениями:
    io.on('connection', function (socket) {
        console.log("New connection: " + socket.id);
        socket.on('set username', function (username) {
            console.log(username);
            socket.data.username = username; // Сохраняем имя пользователя в сокете
        });
        socket.on('chat message', function (message) {
            var username = socket.data.username || 'Anonymous';
            io.emit('chat message', { username: username, message: message, userId: socket.id }); // Отправляем сообщение с именем пользователя
        });
    });
    // Пример работы с комнатами:
    //   io.on('connection', (socket: Socket) => {
    //     socket.on('join room', (room: string) => {
    //       socket.join(room);
    //     });
    //     socket.on('leave room', (room: string) => {
    //       socket.leave(room);
    //     });
    //     socket.on('send message to room', (room: string, message: string) => {
    //       io.to(room).emit('message', message);
    //     });
    //   });
}
exports.registerSocketEvents = registerSocketEvents;
