import express from 'express';
import socketIO from 'socket.io';
import http from 'http';
import path from 'path';

const port = process.env.PORT || 80;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);


app.use('/public', express.static(path.join(__dirname, '/..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/../../index.html'));
});

io.on('connect', socket => {
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
