import express from 'express';
import socketIO from 'socket.io';
import http from 'http';
import path from 'path';
const defaultPort = 3000;
const port = process.env.PORT || defaultPort;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.use('/public', express.static(path.join(__dirname, '/..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/../../index.html'));
});

io.on('connect', socket => {
    // debugging loop
    setInterval(() => {
        socket.emit('message', {
            from: 'james',
            text: 'hi'
        });
    }, 1000)

    socket.on('serverMessage', newMessage => {
        console.log('server: ', newMessage);
    });
});

server.listen(port);
