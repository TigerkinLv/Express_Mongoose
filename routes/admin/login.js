const express = require("express");
const router = express.Router();
const UserModel = require('@model/user');
const md5 = require("md5");
const log4js = require('log4js');
const path = require('path');
const log = log4js.getLogger(path.basename(__filename));

router.post("/login", (req, res) => {
  const { uname, upwd } = req.body;
  UserModel.find({ name: uname, pwd: upwd ? md5(upwd) : "" }, { pwd: 0 }, (err, doc) => {
    if (err) {
      log.error("查询用户失败", err);
      res.status(500).json({ code: -2, msg: "系统错误" })
    } else {
      if (doc.length != 0) {
        res.render("admin.html");
      } else {
        res.render("error.html", {
          errorMsg: "用户名或密码错误"
        })
      }
    }
  })
});

module.exports = router;