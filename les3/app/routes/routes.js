const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
// router.get("/chat.html", protectedController.chat);

module.exports = router;
