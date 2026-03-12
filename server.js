const express = require("express");
const server = express();
const fs = require("node:fs/promises");

server.use(express.urlencoded({ extended: true }));
server.set("view engine", "ejs");




const hostname = "localhost";
const port = 8000;

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});