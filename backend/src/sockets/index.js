"use strict";
exports.__esModule = true;
exports.initSocket = void 0;
var socket_io_1 = require("socket.io");
var events_1 = require("./events");
function initSocket(server) {
    var io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:8080",
            methods: ["GET", "POST"]
        }
    });
    (0, events_1.registerSocketEvents)(io);
}
exports.initSocket = initSocket;
