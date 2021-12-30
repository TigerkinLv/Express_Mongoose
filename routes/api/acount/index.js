const express = require("express");

const router = express.Router();



router.get("/", (req, res) => {
  res.send("账号管理")
});


module.exports = router;