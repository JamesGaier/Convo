import express from 'express';
import socketIO from 'socket.io';
import cors from 'cors';
import http from 'http';
import path from 'path';
import mongoose, { Model } from 'mongoose';
import dotenv from 'dotenv';
import Messages, { MessagesI } from './models/Messages';

dotenv.config();
const defaultPort = 3000;
const port = process.env.PORT || defaultPort;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


mongoose.connect(process.env.MONGOURI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('mongodb connected');
})
.catch(err => console.log(err));

app.use(cors());
app.use('/public', express.static(path.join(__dirname, '/..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/../../index.html'));
});


interface UpdateI {
    $push: MessagesI
}
interface ClientMessageI {
    name: string,
    text: string
}
io.on('connect', socket => {
    socket.on('serverMessage', async (newMessage: ClientMessageI) => {

        // if( !(await Messages.findOne({name: newMessage.name})) ) {
        //     Messages.create({name: newMessage.name, messages: [newMessage.text]});
        // }
        // else {

        //     const message: UpdateI = {$push: {name, messages: [newMessage.text]}};

        //     await Messages.updateOne({name: newMessage.name}, message, (err, res) => {
        //         if(err) throw err;
        //     });
        // }


        socket.broadcast.emit('message', newMessage);
    });
});

server.listen(port);
