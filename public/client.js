const socket = io();

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('ring.mp3');

// Function to append messages to the chat container
function appendMessage(message, position) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

    // Check if the message is from the left (another user's message)
    if (position === 'left') {
        // Try to play the audio, catching any potential errors
        try {
            audio.play();
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

socket.on('receive', (data) => {
    appendMessage(`${data.name}: ${data.message}`, 'left');
});

socket.on('user-joined', (name) => {
    appendMessage(`${name} joined the chat`, 'right');
});

socket.on('leave', (name) => {
    appendMessage(`${name} left the chat`, 'left');
});

const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);


const toggleThemeBtn = document.getElementById('toggle-theme-btn');

