const express = require("express");
const router = express.Router();
const UserModel = require('../../model/user');
const md5 = require("md5");
const log4js = require('log4js');
const path = require('path');
const log = log4js.getLogger(path.basename(__filename));

router.post("/login.do", (req, res) => {
  const { uname, upwd } = req.body;
  // { pwd: 0 }  意思：查询结果不要pwd 字段
  UserModel.find({ name: uname, pwd: upwd ? md5(upwd) : "" }, { pwd: 0 }, (err, doc) => {
    if (err) {
      log.error("查询用户失败", err);
      res.status(500).json({ code: -2, msg: "系统错误" })
    } else {
      if (doc.length != 0) {
        res.json({
          code: 1,
          msg: "查询成功",
          data: doc
        });
      } else {
        res.send({
          code: 0,
          msg: "未查询到当前用户",
        });
      }
    }
  })
});

module.exports = router;