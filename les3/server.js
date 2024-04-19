const express = require("express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");

const bodyParser = require("body-parser");
const authRoutes = require("./app/routes/authRoutes");
const initilizqateSocket = require("./app/socket/socketHandler")

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", authRoutes);

initilizqateSocket(server);


server.listen(3000, () => {
  console.log("Server listens to port 3000");
});
