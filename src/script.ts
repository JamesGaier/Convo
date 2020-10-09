// connect to server
// TODO: change on server side to connect to port 80 ie the internet
const socket = io('http://localhost:3000');

// defines shape of messages
interface MessageI {
    to: string,
    text: string
}

// get the entire screen so you can check for keypresses
const app: HTMLElement | null = document.getElementById("app");

// list of messages
let userMessages: Array<string> = [];

// get the message box
const root = document.getElementById("user");

// make global vars of the row and child that are going to be created
let row: HTMLElement | null = null;
let child: HTMLElement | null = null;

// check if the message's size is greater than 15.  If it is append a special class to the dom element
const msgType = (message: string) => (message.length > 15) ?  "message-bg":"";

// make the message ie set up the ui logic
const makeMessage = (msgType: string, user: boolean) => {
    // choose one of two strings based on whether it is the user
    const append = (lhs: string, rhs: string) => {
        return (user) ? lhs : rhs;
    };

    row!.className = "d-flex justify-content-" + append("end", "start");
    child!.className = msgType + " message bg-" + append("primary", "success") + " mt-3";
};
// makes the message for the user
async function createMessage(message: string) {

    // create the dom elements
    row = document.createElement("div");
    child = document.createElement("div");

    // send a message to the server, to is uneeded currently
    // TODO: add a page that asks for name that redirects to chat app
    await socket.emit('message', {
        to: 'bob',
        text: message
    })

    // set message text and set up ui logic
    child!.innerHTML = message;
    makeMessage(msgType(message), true);

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
        let textfield = document.getElementById("chatbox") as HTMLInputElement;

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
        makeMessage(msgType(msg.text), false);
        child!.innerHTML = msg.text;

        // append to dom
        row?.appendChild(child!);
        root?.appendChild(row!);

        // scroll to current
        row?.scrollIntoView();
    });
}