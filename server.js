// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Load chatbot dataset
let chatbotData;
fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading dataset:", err);
        chatbotData = [];
    } else {
        chatbotData = JSON.parse(data);
    }
});

// Chatbot response function
function getBotResponse(message) {
    const lowerCaseMessage = message.toLowerCase();
    const foundEntry = chatbotData.find(entry => lowerCaseMessage.includes(entry.question.toLowerCase()));
    return foundEntry ? foundEntry.response : "I'm sorry, I didn't understand that. Could you rephrase?";
}

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('user message', (msg) => {
        const botResponse = getBotResponse(msg);
        socket.emit('bot response', botResponse);
    });
    
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
