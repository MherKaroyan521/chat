const express = require("express");
const path = require('path');
const http = require('http');
const socket = require("socket.io");
const formatMessaages = require("./app/utils/message.js");
const bodyParser = require("body-parser");
const FS = require("fs")

const app = express();
const PORT = 3000;
const server = http.createServer(app);
const io = socket(server);
const usersFilePath = path.join(__dirname, "public/users.json");

app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({extended: false}));

app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: `Internal server error: Error reading users file: ${err}` });
    }
    let users = [];
    if (data) {
      try {
        users = JSON.parse(data); 
      } 
      catch (parseError) {
        console.error("Error parsing users file:", parseError);
        return res.status(500).json({ message: "Internal server error" });
      }
      const existingUser = users.find((user) => user.username === username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const newUser = { username, password };
      users.push(newUser);
      
    }

  })

  res.redirect("/chat.html");
})

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