const express = require("express");

const router = express.Router();

const register = require("./register");
const login = require("./login");

router.get("/", (req, res) => {
  res.render("login.html");
});

router.use("/register", register);
router.use("/login", login);



module.exports = router;