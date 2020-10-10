"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const defaultPort = 3000;
const port = process.env.PORT || defaultPort;
const app = express_1.default();
const server = http_1.default.createServer(app);
const io = socket_io_1.default(server);
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '/..')));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '/../../index.html'));
});
io.on('connect', socket => {
    // debugging loop
    setInterval(() => {
        socket.emit('message', {
            from: 'james',
            text: 'hi'
        });
    }, 1000);
    socket.on('serverMessage', newMessage => {
        console.log('server: ', newMessage);
    });
});
server.listen(port);
