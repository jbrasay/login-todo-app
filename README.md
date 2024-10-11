# Todo App

This Todo application is a project designed to learn and practice the MERN stack (MongoDB, Express, React, Node.js). Users can create an account and log in, after which they can create, read, update, and delete their todos.

<p float="left">
    <img src="https://github.com/jbrasay/project-screenshots/blob/4f7dbee32772689b17f6e82411caedd6fdecd71f/screenshots/login-todo-app/todo-login.png" width="400" height="400">
    <img src="https://github.com/jbrasay/project-screenshots/blob/4f7dbee32772689b17f6e82411caedd6fdecd71f/screenshots/login-todo-app/todo-signup.png" width="400" height="400">
</p>
<p align="middle">
    <img src="https://github.com/jbrasay/project-screenshots/blob/4f7dbee32772689b17f6e82411caedd6fdecd71f/screenshots/login-todo-app/todo-main.png">
</p>

## Features

- Login and Sign up functionality
- Create, read, update, and delete todos

## Technologies

- **Frontend:** 
  - React
  - Tailwind CSS
  - Flowbite React
  - daisyUI
- **Backend:** 
  - Node.js
  - Express
- **Database:** 
  - MongoDB
  - Mongoose
- **HTTP Client:** 
  - Axios
- **Middleware:** 
  - CORS (For handling Cross-Origin requests)
  - cookie-parser (for handling cookies)
  - bcrypt (for hashing passwords)
  - jsonwebtoken (for creating web tokens)

## Project Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/jbrasay/login-todo-app.git
   cd todo-app

2. Navigate to the server directory and install dependencies:

   ```bash
   cd  server
   npm install express mongodb dotenv nodemon cors mongoose bcrypt jswonwebtoken validator cookie-parser

3. Navigate to the client directory and install dependencies:
   ```bash
   cd client
   npm install
   npm install react-router-dom
   npm install axios
   npm install -D tailwindcss pstcss autoprefixer
   npm install flowbite-react
   npm install -D daisyui@latest
   

4. Set up your environment variables for MongoDB. Create a .env file in the server directory and add your MongoDB connection string:

   ```bash
   MONGODB_URI=your_mongodb_connection_string
   PORT=your_server_port
   TOKEN=your_token_key
   ```
 
   Note: You can generate a 32-byte string token key by running the command below on your terminal
   ```bash
   node
   require("crypto").randomBytes(32).toString("hex") 

## Starting Project

1. Start the server:
   
   ```bash
   cd server
   npm start

2. In a new terminal, start the client:
  
   ```bash
   cd client
   npm run dev