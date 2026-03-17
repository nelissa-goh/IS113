const dotenv = require('dotenv');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

const usersRoutes = require("./routes/users-routes");
const moviesRoutes = require('./routes/movies-routes');

const server = express();

// add this line when you are using Express to do form (POST)
server.use(express.urlencoded({ extended: true }));

// express.json() is a middleware
server.use(express.json());

// set EJS as the view engine for rendering dynamic HTML pages
server.set("view engine", "ejs");

// root routes
server.use('/', usersRoutes);
server.use('/', moviesRoutes);

// path to the environment variable file 'config.env'
dotenv.config({ path: './config.env' });

server.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));

// async function to connect to DB
async function connectDB() {
  try {
    // connecting to Database with our config.env file and DB is constant in config.env
    await mongoose.connect(process.env.DB);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

function startServer() {
  const hostname = "localhost"; // define server hostname
  const port = 8000;// define port number
 
  // start the server and listen on the specified hostname and port
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

// call connectDB first and when connection is ready we start the web server
connectDB().then(startServer);
