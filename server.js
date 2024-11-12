const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const https = require('https');  // Use the built-in https module for API requests

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

// Function to get response from Google Gemini API
function getGeminiResponse(message, callback) {
    const apiKey = 'AIzaSyCixY7CYJNfUi3r0HCP-Hs14VnCM1KwM3Q';  
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    // Adjusted request body format for Gemini API
    const data = JSON.stringify({
        input: {
            text: message,  // Using "text" instead of "prompt"
        },
        parameters: {
            temperature: 0.7,
            max_tokens: 150,  // Adjusted max tokens parameter
        }
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: `/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
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
            // Log the full response for debugging
            console.log('Full response from Gemini API:', responseData);
            console.log('Response status code:', res.statusCode);
            console.log('Response headers:', res.headers);

            try {
                const parsedData = JSON.parse(responseData);

                // Handle potential errors from the Gemini API
                if (parsedData.error) {
                    console.error('API Error:', parsedData.error);
                    callback(`Error from Gemini API: ${parsedData.error.message}`, null);
                    return;
                }

                // Check if the API returns generated content
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

// Function to get a bot response (from local data or Gemini API)
function getBotResponse(message, callback) {
    const lowerCaseMessage = message.toLowerCase();
    const foundEntry = chatbotData.find(entry => lowerCaseMessage.includes(entry.question.toLowerCase()));
    
    if (foundEntry) {
        callback(null, foundEntry.response);
    } else {
        // If no match found, use Gemini API
        getGeminiResponse(message, callback);
    }
}

// Socket.IO connection handling
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
