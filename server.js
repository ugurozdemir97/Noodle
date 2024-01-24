// Import
const express = require("express");  // Library for server
const mongoose = require("mongoose");  // DataBase
const session = require("express-session");  // Handle if logged in and if authorized information
const MemoryStore = require('memorystore')(session)  // Express session leaks memory, this library prevents memory leaks
const {Server} = require("socket.io"); // Communication between users / Client - Server => {} are important!
const http = require('http');  // Required for socket io to work with express-session
require("dotenv").config()  // Environment variables

// Routes
const authentication = require("./routes/authentication");  // Authentication pages
const username = require("./routes/username");  // Change Username
const searchUser = require("./routes/searchUsers");  // Search for users
const messages = require("./routes/sendMessages");  // Load and update last seen message
const uploadImages = require("./routes/uploadImages");  // Upload profile pictures

// Socket io
const liveCommunication = require("./controllers/liveCommunication");

// Middlewares
const sessionMiddleware = require("./controllers/sessionMiddleware");
const updateUsers = require("./controllers/updateUser");

// Connect to the database
const connection = mongoose.connect(process.env.MONGOOSE); 
connection
.then(() => {console.log("Database Connection is Successful!")})
.catch(() => {console.log("Can not connect to the Database")})

// Setup the server
const app = express()  // Our server
const server = http.createServer(app);  // This is for socket.io to work with express-session
const io = new Server(server);  // Create a server for socket.io

// Send io object to the modules
liveCommunication(io)

// Server configurations
app.set('socketio', io);  // Tou will be able to use socket io in routes using: req.app.get('socketio');
app.set("view engine", "ejs")  // Set ejs as view engine
app.use(express.static("public"))  // Use public folder for static files
app.use(express.urlencoded({extended: true}))  // To send and get data as req.body
app.use(express.json())

// Session configurations
app.use(session({
    secret: process.env.SECRET,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7},  // Expiring date = 1 week
    store: new MemoryStore({  // This is from memorystorage library
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: false,
}))

// Middlewares, I've separated them because I want my server.js to be clean. 
// Basically instead of using app.use() here, I send app as a parameter and use "app.use()" in other files.
sessionMiddleware(app)
updateUsers(app)

// Main page
app.get("/", async (req, res) => {res.render("index")})

// Use routes
app.use(authentication);  // Login users
app.use(username);  // Changing username route
app.use(searchUser);  // Searching users route
app.use(messages);  // Load and update last seen message
app.use(uploadImages);  // Upload images

// Server is running on port 3000
server.listen(process.env.PORT, () => {
    console.log(`The server is running on:\nlocalhost:${process.env.PORT}`)  // Just to copy paste 
})
