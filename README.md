
---

# Chatbot with Node.js and Socket.IO

A simple yet responsive chatbot built with **Node.js**, **Socket.IO**, and **Bootstrap**. This chatbot provides a clean and professional user interface and allows real-time communication between a user and the bot.
Collaboration 🤝
This project was created in collaboration with:

- 👨‍💻 [Himanshu Verma](https://www.linkedin.com/in/himanshu-verma12/)
- 🧑‍💼 [Ankit](https://www.linkedin.com/in/himanshu-verma12/)

Together, we built an intuitive and interactive chatbot interface!

## Features

- Real-time messaging using Socket.IO
- Clean, responsive UI with Bootstrap
- Emojis and icons for enhanced user experience
- Nodemon integration for fast development

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To run this project locally, ensure you have Node.js and npm installed on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v12+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/chatbot-project.git
   cd chatbot-project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server using Nodemon:

   ```bash
   npm start
   ```

4. Open your browser and go to:

   ```
   http://localhost:3000
   ```

## Usage

- **User Message**: Type a message in the input box and click the send button or press Enter to send the message to the bot.
- **Bot Response**: The bot will respond to user messages in real-time, providing interactive responses based on the dataset.

### Sample Data Format

The bot uses a sample JSON dataset to respond to user queries. The data should follow this format:

```json
[
    { "question": "Hello", "answer": "Hi there! How can I help you today?" },
    { "question": "What is Node.js?", "answer": "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine." }
]
```

> The dataset file should be located in the root directory and named `dataset.json`.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web framework for Node.js.
- **Socket.IO**: Library for real-time web applications.
- **Bootstrap**: CSS framework for responsive design.
- **Nodemon**: Tool for auto-restarting the server on file changes.
  
## Project Structure

```
├── public
│   ├── index.html          # Frontend HTML with chat UI
│   ├── script.js           # Client-side JavaScript
│   └── styles.css          # Styles for the chat UI
├── dataset.json            # JSON file with bot's Q&A dataset
├── server.js               # Main server file
├── package.json            # Project metadata and dependencies
└── README.md               # Project documentation
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the project.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit (`git commit -am 'Add your feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
