const express = require("express");
const path = require('path');
const http = require('http');
const socket = require("socket.io");

const app = express();
const PORT = 3000;
const server = http.createServer(app);
const io = socket(server);

app.use(express.static(path.join(__dirname,"public")));

io.on("connection", (socket)=>{
  socket.broadcast.emit("message", "a user join");
  socket.emit("message", "Welcome");
  socket.on("chatMSG", (m)=>{
    io.emit("message", m);
  })

  socket.on("disconnect", ()=>{
    io.emit("message", "A user left the chat")
  })
})

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});