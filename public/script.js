// public/script.js
const socket = io();
const input = document.getElementById('input');
const chat = document.getElementById('chat');
const sendBtn = document.getElementById('send-btn');

// Function to send the user's message
function sendMessage() {
    const message = input.value.trim();
    if (message) {
        addMessage(`You: ${message} `, 'user');
        socket.emit('user message', message);
        input.value = '';
        input.focus();  // Refocus on the input field after sending
    }
}

// Function to add a message to the chat
function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    chat.appendChild(messageElement);
    chat.scrollTop = chat.scrollHeight;  // Scroll to the bottom of the chat
}

// Event listener for Enter key
input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Event listener for Send button
sendBtn.addEventListener('click', sendMessage);

// Listen for bot responses
socket.on('bot response', (response) => {
    addMessage(`Bot: ${response} 🤖`, 'bot');
});
