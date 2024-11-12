const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const axios = require('axios');  // Importing axios for API requests

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Load local chatbot data from JSON
let chatbotData;
fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading dataset:", err);
        chatbotData = [];
    } else {
        chatbotData = JSON.parse(data);
    }
});

// Function to get response from Google Gemini API using axios
async function getGeminiResponse(message) {
    const apiKey = 'AIzaSyCixY7CYJNfUi3r0HCP-Hs14VnCM1KwM3Q';  // Replace with your API key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    // Constructing the payload according to the API specifications
    const data = {
        input: {
            text: message,  // Use "text" as the key for input
        },
        parameters: {
            temperature: 0.7,
            maxOutputTokens: 150,
        }
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const botResponse = response.data.generatedContent;
        if (botResponse) {
            return botResponse.trim();
        } else {
            throw new Error('No response generated by Gemini API');
        }
    } catch (error) {
        console.error('Error from Gemini API:', error.response ? error.response.data : error.message);
        throw new Error('Error from Gemini API');
    }
}

// Function to get a bot response (local data or Gemini API)
async function getBotResponse(message) {
    const lowerCaseMessage = message.toLowerCase();
    const foundEntry = chatbotData.find(entry => lowerCaseMessage.includes(entry.question.toLowerCase()));
    
    if (foundEntry) {
        return foundEntry.response;  // Return local match
    } else {
        return await getGeminiResponse(message);  // Fallback to Gemini API
    }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('user message', async (msg) => {
        try {
            const botResponse = await getBotResponse(msg);
            socket.emit('bot response', botResponse);  // Send bot response
        } catch (error) {
            socket.emit('bot response', error.message);  // Send error message if no response
        }
    });
    
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
