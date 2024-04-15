const path = require('path');
const fs = require("fs")
const usersFilePath = path.join(__dirname, "../../public/user.json");

app.use(express.static(path.join(__dirname,"../../public")));
app.use(bodyParser.urlencoded({extended: false}));

const signup = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password);
  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading users file:", err);
      return res.status(500).json({ message: `Internal server error ${err}` });
    }
    let users = [];
    if (data) {
      try {
        users = JSON.parse(data);
      } catch (parseError) {
        console.error("Error parsing users file:", parseError);
        return res.status(500).json({ message: `Internal server error ${err}`});
      }
    }
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      const successMessage= "Username already exists";
      const status='Fail';
      res.status(400).redirect(`/signup.html?message=${successMessage}&status=${status}`);
      return;
    }
    const newUser = { username, password };
    users.push(newUser);
    fs.writeFile(usersFilePath, JSON.stringify(users), "utf8", (writeErr) => {
      if (writeErr) {
        console.error("Error writing users file:", writeErr);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.status(201).json({ message: "User registered successfully", user: newUser });
    });
    const successMessage= "User registered successfully";
    const status='Success';
    res.status(201).redirect(`/?message=${successMessage}&status=${status}`);
  });
});

module.exports = {signup};