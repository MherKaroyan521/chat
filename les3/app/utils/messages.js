const moment = require("moment");
const formatMessages = (username, text, noavatar) => {
  if(!noavatar){
    return {
      text: text,
      username: username,
      time: moment().format("h:mm a"),
      noavatar: false
    };
  }else{
    return {
      text: text,
      username: username,
      time: moment().format("h:mm a"),
      noavatar: true
    };
  }

};
module.exports = formatMessages;
