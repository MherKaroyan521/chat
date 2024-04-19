const bcrypt = require("bcryptjs")

const hashPass = async (pass) => {
  return await bcrypt.hash(pass, 10);
}

const comparePass = async (pass, hashedPass) => {
  return await bcrypt.compare(pass, hashedPass);
}

module.exports = {hashPass, comparePass};