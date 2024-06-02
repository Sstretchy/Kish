"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const events_1 = require("./events");
function initSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:8080", // Разрешить запросы с фронтенда
            methods: ["GET", "POST"]
        }
    });
    (0, events_1.registerSocketEvents)(io);
}
exports.initSocket = initSocket;
