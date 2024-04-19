const socket = require("socket.io");
const formatMessage = require("../utils/messages");
const jwt = require("jsonwebtoken");

  const { hashPass, comparePass } = require("../utils/bcrypt")

  const uuid = require("uuid");


const initilizqateSocket = (server)=>{
  const io = socket(server)
  io.on("connection", (socket) => {
    socket.emit("message", formatMessage("BOT", "welcome!"));
    socket.broadcast.emit(
      "message",
      formatMessage("BOT", "A user just connected!")
    );
  
    socket.on("chatMsg", (m) => {
      io.emit("message", formatMessage("USER", m));
    });
  
    socket.on("disconnect", () => {
      io.emit("message", formatMessage("BOT", "A user has just left!"));
    });
  });
}

module.exports = initilizqateSocket;