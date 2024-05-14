"use strict";
exports.__esModule = true;
var express = require("express");
var cors = require("cors");
var http_1 = require("http");
var sockets_1 = require("./src/sockets");
var app = express();
var PORT = process.env.PORT || 3001;
var server = (0, http_1.createServer)(app);
(0, sockets_1.initSocket)(server);
app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST']
}));
app.get('/', function (req, res) {
    res.send('Привет, мир!');
});
server.listen(PORT, function () {
    console.log("\u0421\u0435\u0440\u0432\u0435\u0440 \u0437\u0430\u043F\u0443\u0449\u0435\u043D \u043D\u0430 \u043F\u043E\u0440\u0442\u0435 " + PORT);
});
