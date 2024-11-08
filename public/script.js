const socket = io();
const input = document.getElementById('input');
const chat = document.getElementById('chat');
const sendBtn = document.getElementById('send-btn');

function sendMessage() {
    const message = input.value.trim();
    if (message) {
        addMessage(`You: ${message} `, 'user');
        socket.emit('user message', message);
        input.value = '';
        input.focus();  
    }
}

function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    chat.appendChild(messageElement);
    chat.scrollTop = chat.scrollHeight;  
}

input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);

socket.on('bot response', (response) => {
    addMessage(`Bot: ${response} 🤖`, 'bot');
});
