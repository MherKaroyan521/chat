const users = [];

const userJoin = (id,username,room)=>{
  const user = {id,username,room}
  users.push(user);
  console.log(users)
  return user;
}

const getCurrentUser = (id) => {
  return users.find((user)=>user.id === id);

}

const userLeave = (id) => {
  const index = users.findIndex((user) => {
    return user.id = id
  })
  let user = users[index]; 
  if(index !== -1){
    users.splice(index, 1)[0]
  }
  return user;
}

const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
}

module.exports = {userJoin, getCurrentUser, userLeave, getRoomUsers}