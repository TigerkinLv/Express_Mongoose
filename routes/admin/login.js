const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("用户注册");
});

module.exports = router;