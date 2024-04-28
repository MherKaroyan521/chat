const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const formidable = require("formidable");
const { hashPass, comparePass } = require("../utils/bcrypt");
const { use } = require("../routes/routes");
require("dotenv").config();

const usersFilePath = path.join(__dirname, "../../public/users.json");
const JWT_SECRET_KEY = process.env.MY_CUSTOM_SECRET_KEY;

const signUp = (req, res) => {
  let username;
  let password;


  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    username = fields.username[0];
    password = fields.password[0];

    if(!files.img){
      const message = "You must insert image";
      const status = "fail";
      return res.status(400).redirect(`/signup.html?message=${message}&status=${status}`);
    }

    if(files.img[0].originalFilename.split(".")[1] != "jpg" && files.img[0].originalFilename.split(".")[1] != "jpeg"){
      const message = "You must insert jpg and jpeg img types";
      const status = "fail";
      return res.status(400).redirect(`/signup.html?message=${message}&status=${status}`);
    }

    
    let oldpath = files.img[0].filepath;
    let newpath = `img/${username}.jpeg`

    fs.readFile(usersFilePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading users file:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
  
      let users = [];
      if (data) {
        try {
          users = JSON.parse(data);
        } catch (parseError) {
          console.error("Error parsing users file:", parseError);
          return res.status(500).json({ message: "Internal server error" });
        }
      }
  
      const existingUser = users.find((user) => user.username === username);
      if (existingUser) {
        const failMessage = "Username already exists";
        const status = "fail";
        return res.status(400).redirect(`signup.html?message=${failMessage}&status=${status}`);
      }
  
      fs.rename(oldpath, newpath, function(err) {
        console.log(err);
      })
  
      hashPass(password).then((bcryptedPassword) => {
        const token = jwt.sign({ username }, JWT_SECRET_KEY);
        const id = uuid.v4();
        const newUser = { id, username, password: bcryptedPassword, token };
        users.push(newUser);
  
        fs.writeFile(usersFilePath, JSON.stringify(users), "utf8", (writeErr) => {
          if (writeErr) {
            console.error("Error writing users file:", writeErr);
            return res.status(500).json({ message: "Internal server error" });
          }
          const successMessage = "Signup successful. Please login.";
          const status = "success";
          res
            .status(201)
            .redirect(`/?message=${successMessage}&status=${status}`);
        });
      });
    });
  })
};

const login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const room = req.body.room;

  fs.readFile(usersFilePath, "utf-8", (err, fileData) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    let users = [];
    if (fileData) {
      try {
        users = JSON.parse(fileData);
      } catch (err) {
        return res.status(500).json({ message: "internal server error" });
      }
    }
    const user = users.find((user) => user.username === username);
    if (!user) {
      const message = "Username does not exist!";
      const status = "fail";
      return res.status(404).redirect(`/?message=${message}&status=${status}`);
    }
    comparePass(password, user.password)
      .then((match) => {
        if (match) {
          const token = jwt.sign({ username, room }, JWT_SECRET_KEY);
          res.redirect(`/chat.html?token=${token}`);
        } else {
          const message = "Incorrect username or password.";
          const status = "fail";
          res.redirect(`/?message=${message}&status=${status}`);
        }
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ message: `Internal server error: ${err}` });
      });
  });
};

module.exports = { signUp, login };
