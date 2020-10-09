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
const socket = io('http://localhost:3000');
// make connection with server from user side
const app = document.getElementById("app");
let userMessages = [];
const root = document.getElementById("user");
let row = null;
let child = null;
const msgType = (message) => (message.length > 15) ? "message-bg" : "";
const makeMessage = (msgType, user) => {
    row.className = "d-flex justify-content-" + ((user) ? "end" : "start");
    child.className = msgType + " message bg-" + (((user) ? "primary" : "success")) + " mt-3";
};
function createMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        row = document.createElement("div");
        child = document.createElement("div");
        yield socket.emit('message', {
            to: 'bob',
            text: message
        });
        child.innerHTML = message;
        makeMessage(msgType(message), true);
        row === null || row === void 0 ? void 0 : row.appendChild(child);
        root === null || root === void 0 ? void 0 : root.appendChild(row);
        row === null || row === void 0 ? void 0 : row.scrollIntoView();
    });
}
app === null || app === void 0 ? void 0 : app.addEventListener("keyup", function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let textfield = document.getElementById("chatbox");
        if (textfield.value !== '') {
            userMessages.push(textfield === null || textfield === void 0 ? void 0 : textfield.value);
            console.log(userMessages);
            createMessage(textfield === null || textfield === void 0 ? void 0 : textfield.value);
            textfield.value = '';
        }
    }
});
window.onload = () => {
    socket.on('message', (msg) => {
        row = document.createElement("div");
        child = document.createElement("div");
        console.log('client: ', msg.text);
        makeMessage(msgType(msg.text), false);
        child.innerHTML = msg.text;
        row === null || row === void 0 ? void 0 : row.appendChild(child);
        root === null || root === void 0 ? void 0 : root.appendChild(row);
        row === null || row === void 0 ? void 0 : row.scrollIntoView();
    });
};
