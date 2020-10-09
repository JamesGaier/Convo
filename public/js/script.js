"use strict";
// types
// globals
// code that is ran as part of the script eg onload
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// connect to server
// TODO: change on server side to connect to port 80 ie the internet
const socket = io('http://localhost:3000');
// get the entire screen so you can check for keypresses
const app = document.getElementById("app");
// list of messages
let userMessages = [];
// get the message box
const root = document.getElementById("user");
// make global vars of the row and child that are going to be created
let row = null;
let child = null;
// check if the message's size is greater than 15.  If it is append a special class to the dom element
const msgType = (message) => (message.length > 15) ? "message-bg" : "";
// make the message ie set up the ui logic
const makeMessage = (msgType, user) => {
    // choose one of two strings based on whether it is the user
    const choose = (lhs, rhs) => {
        return (user) ? lhs : rhs;
    };
    row.className = "d-flex justify-content-" + choose("end", "start");
    child.className = msgType + " message bg-" + choose("primary", "success") + " mt-3";
};
// makes the message for the user
function createMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        // create the dom elements
        row = document.createElement("div");
        child = document.createElement("div");
        // send a message to the server, to is uneeded currently
        // TODO: add a page that asks for name that redirects to chat app
        socket.emit('serverMessage', {
            to: 'bob',
            text: message
        });
        // set message text and set up ui logic
        child.innerHTML = message;
        makeMessage(msgType(message), true);
        // add the elements to the dom
        row === null || row === void 0 ? void 0 : row.appendChild(child);
        root === null || root === void 0 ? void 0 : root.appendChild(row);
        // scroll to latest message
        row === null || row === void 0 ? void 0 : row.scrollIntoView();
    });
}
// if a key is pressed anywhere on the screen
app === null || app === void 0 ? void 0 : app.addEventListener("keyup", function (event) {
    // if that key is enter
    if (event.key === 'Enter') {
        // prevent the default activity for that html element
        event.preventDefault();
        // get the chatbox
        let textfield = document.getElementById("chatbox");
        // if the input is not empty
        if (textfield.value !== '') {
            // push the input into a list of messages
            userMessages.push(textfield === null || textfield === void 0 ? void 0 : textfield.value);
            console.log(userMessages);
            // create the message
            createMessage(textfield === null || textfield === void 0 ? void 0 : textfield.value);
            // set the text box to empty
            textfield.value = '';
        }
    }
});
// when the screen starts
window.onload = () => {
    // when the server sends a message
    socket.on('message', (msg) => {
        // create the row and and message
        row = document.createElement("div");
        child = document.createElement("div");
        // set up the ui logic
        makeMessage(msgType(msg.text), false);
        child.innerHTML = msg.text;
        // append to dom
        row === null || row === void 0 ? void 0 : row.appendChild(child);
        root === null || root === void 0 ? void 0 : root.appendChild(row);
        // scroll to current
        row === null || row === void 0 ? void 0 : row.scrollIntoView();
    });
};
