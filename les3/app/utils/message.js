const moment = require("moment");

const formatMessaages = (username, message)=>{
  return {
    username,
    message,
    time: moment().format("h:m a")
  }
}

module.exports = formatMessaages;