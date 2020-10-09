// types
// globals
// code that is ran as part of the script eg onload


// connect to server
const socket = io('http://localhost:80');

// defines shape of messages
interface MessageI {
    to: string,
    text: string
}

// get the entire screen so you can check for keypresses
const app: HTMLElement | null = document.getElementById("app");

// list of messages
const userMessages: Array<string> = [];

// get the message box
const root = document.getElementById("user");

// make global vars of the row and child that are going to be created
let row: HTMLElement | null = null;
let child: HTMLElement | null = null;

const MSGLIMIT = 15;

// check if the message's size is greater than 15.  If it is append a special class to the dom element
const msgboxRounding = function (message: string) { return  (message.length > MSGLIMIT) ?  "message-bg":"" };

// make the message ie set up the ui logic
const makeMessage = (msgType: string, user: boolean) => {
    // choose one of two strings based on whether it is the user
    const choose = (lhs: string, rhs: string) => {
        return (user) ? lhs : rhs;
    };

    row!.className = "d-flex justify-content-" + choose("end", "start");
    child!.className = msgType + " message bg-" + choose("primary", "success") + " mt-3";
};
// makes the message for the user
async function createMessage(message: string) {

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
    child!.innerHTML = message;
    makeMessage(msgboxRounding(message), true);

    // add the elements to the dom
    row?.appendChild(child);
    root?.appendChild(row!);

    // scroll to latest message
    row?.scrollIntoView();
}

// if a key is pressed anywhere on the screen
app?.addEventListener("keyup", function(event) {
    // if that key is enter
    if(event.key === 'Enter') {
        // prevent the default activity for that html element
        event.preventDefault();
        // get the chatbox
        const textfield = document.getElementById("chatbox") as HTMLInputElement;

        // if the input is not empty
        if(textfield.value !== '') {
            // push the input into a list of messages
            userMessages.push(textfield?.value);
            console.log(userMessages);
            // create the message
            createMessage(textfield?.value);
            // set the text box to empty
            textfield.value = '';

        }
    }
});
// when the screen starts
window.onload = () => {
    // when the server sends a message
    socket.on('message', (msg: MessageI) => {
        // create the row and and message
        row = document.createElement("div");
        child = document.createElement("div");

        // set up the ui logic
        makeMessage(msgboxRounding(msg.text), false);
        child!.innerHTML = msg.text;

        // append to dom
        row?.appendChild(child!);
        root?.appendChild(row!);

        // scroll to current
        row?.scrollIntoView();
    });
}