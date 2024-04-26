const socket = require("socket.io");
const formatMessage = require("../utils/messages");
const jwt = require("jsonwebtoken");

  const { hashPass, comparePass } = require("../utils/bcrypt")

  const uuid = require("uuid");
  require("dotenv").config();

  const JWT_SECRET_KEY = process.env.MY_CUSTOM_SECRET_KEY;
const {userJoin, userLeave, getCurrentUser, getRoomUsers} = require("../utils/user");
const initilizqateSocket = (server)=>{
  const io = socket(server)
  io.on("connection", (socket) => {
    
    socket.on("JoinRoom", (tocken) =>{
      try{
        const decoded = jwt.verify(tocken, JWT_SECRET_KEY)
        const {username, room} = decoded;
        let user = userJoin(socket.id, username, room)
        socket.join(user.room);
        
        io.to(user.room).emit("usersInRoom", {
          room: user.room,
          userslist: getRoomUsers(user.room)
        });
        socket.emit("message", formatMessage("BOT", `welcome ${user.username}!`));
        io.to(user.room).emit(
          "message",
          formatMessage("BOT", `A ${user.username} just connected!`)
        );
      }catch (error){
        console.log(error); 
      }
    })
  
    socket.on("chatMsg", (m) => {
      io.emit("message", formatMessage("USER", m));
    });
  
    socket.on("disconnect", () => {
      const user = userLeave(socket.id)
      console.log(user, 1231243)
      if(user){
        io.to(user.room).emit("message", formatMessage("BOT", `${user.username} has just left!`))
        io.to(user.room).emit('usersInRoom', {
          room:user.room,
          usersList:getRoomUsers(user.room)
        })
      };
    });
  })
}

module.exports = initilizqateSocket;