const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const https = require('https');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let chatbotData;
fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading dataset:", err);
        chatbotData = [];
    } else {
        chatbotData = JSON.parse(data);
    }
});

// Function to call Google Gemini API and get the response
function getGeminiResponse(message, callback) {
    const apiKey = 'AIzaSyCixY7CYJNfUi3r0HCP-Hs14VnCM1KwM3Q';  // Your API key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const data = JSON.stringify({
        prompt: message,
        temperature: 0.7,  // Control the creativity of the response
        maxOutputTokens: 150,  // Limit the response length
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: '/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + apiKey,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
        },
    };

    const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });

        res.on('end', () => {
            try {
                const parsedData = JSON.parse(responseData);
                console.log('Response from Gemini API:', parsedData); // Log the entire response to check the structure

                if (parsedData.generatedContent) {
                    callback(null, parsedData.generatedContent.trim());
                } else {
                    callback("No response generated from Gemini API", null);
                }
            } catch (error) {
                console.error('Error parsing response from Google Gemini API:', error);
                callback("Error parsing the response", null);
            }
        });
    });

    req.on('error', (error) => {
        console.error('Error calling Google Gemini API:', error);
        callback("Error calling the API", null);
    });

    req.write(data);
    req.end();
}

// Function to get a response from either the local dataset or Google Gemini
function getBotResponse(message, callback) {
    const lowerCaseMessage = message.toLowerCase();
    const foundEntry = chatbotData.find(entry => lowerCaseMessage.includes(entry.question.toLowerCase()));

    // If the message is found in the local dataset, return the local response
    if (foundEntry) {
        callback(null, foundEntry.response);
    } else {
        // Otherwise, fall back to Google Gemini API
        getGeminiResponse(message, callback);
    }
}

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('user message', (msg) => {
        getBotResponse(msg, (error, botResponse) => {
            if (error) {
                socket.emit('bot response', error);
            } else {
                socket.emit('bot response', botResponse);
            }
        });
    });
    
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
