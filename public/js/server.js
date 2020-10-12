"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Messages_1 = __importDefault(require("./models/Messages"));
dotenv_1.default.config();
const defaultPort = 3000;
const port = process.env.PORT || defaultPort;
const app = express_1.default();
const server = http_1.default.createServer(app);
const io = socket_io_1.default(server);
mongoose_1.default.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
    console.log('mongodb connected');
})
    .catch(err => console.log(err));
app.use(cors_1.default());
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '/..')));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '/../../index.html'));
});
io.on('connect', socket => {
    socket.on('serverMessage', (newMessage) => __awaiter(void 0, void 0, void 0, function* () {
        if (!(yield Messages_1.default.findOne({ name: newMessage.name }))) {
            Messages_1.default.create({ name: newMessage.name, messages: [newMessage.text] });
        }
        else {
            const message = { $push: { name, messages: [newMessage.text] } };
            yield Messages_1.default.updateOne({ name: newMessage.name }, message, (err, res) => {
                if (err)
                    throw err;
            });
        }
        socket.broadcast.emit('message', newMessage);
    }));
});
server.listen(port);
