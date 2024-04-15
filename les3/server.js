const express = require("express");
const path = require('path');
const http = require('http');
const socket = require("socket.io");
const formatMessaages = require("./app/utils/message.js");
const bodyParser = require("body-parser");
const authRouter = require("app/routes/authRoutes.js")

const app = express();
const PORT = 3000;
const server = http.createServer(app);
const io = socket(server);

app.use(express.static(path.join(__dirname,"../../public")));
app.use(bodyParser.urlencoded({extended: false}));
app.use("/", authRouter)


io.on("connection", (socket)=>{
  socket.broadcast.emit("message", formatMessaages("Bot", "A user just join"));
  socket.emit("message", formatMessaages("Bot", "Welcome"));
  socket.on('chatMsg', (m)=>{
    io.emit('message', formatMessaages("User", m))
  })

  socket.on("disconnect", ()=>{
    io.emit("message", formatMessaages("User", "User left the chat"))
  })
})

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});