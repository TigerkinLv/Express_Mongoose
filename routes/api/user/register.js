const express = require("express");
const router = express.Router();
const md5 = require("md5");
const UserModel = require("@model/user");
const log4js = require('log4js');
const path = require('path');
const log = log4js.getLogger(path.basename(__filename));

// 注册
router.post("/register.do", (req, res) => {
  const { uname, upwd, phone, age, sex } = req.body;
  let user = new UserModel({
    name: uname,
    pwd: upwd ? md5(upwd) : "",
    phone: phone,
    age: age,
    sex: sex
  });
  user.save((err) => {
    if (err) {
      if (err.code === 11000) {
        return res.send({ code: -1, message: '用户已存在!' })
      } else {
        let error = err.errors;
        log.error("用户注册", error);
        for (let errName in error) {
          res.send({
            code: -1,
            msg: error[errName]['message']
          })
        }
      }
    } else {
      res.send({
        code: 1,
        msg: "注册成功"
      });
    }
  })
});

// 注销
router.delete("/logoff.do", (req, res) => {
  const { uname, upwd } = req.body;
  UserModel.find({ name: uname, pwd: upwd ? md5(upwd) : "" }, (err, doc) => {
    if (err) {
      log.error("查询用户失败", err);
      res.status(500).json({ code: -2, msg: "系统错误,请联系管理员" })
    } else {
      if (doc.length > 0) {
        UserModel.deleteOne({ name: uname }, (err) => {
          if (err) {
            log.error("用户注销失败", { uname }, err);
            res.status(500).json({ code: -2, msg: "系统错误,请联系管理员" })
          } else {
            res.json({
              code: 1,
              msg: "注销成功"
            })
          }
        });
      } else {
        res.json({
          code: -1,
          msg: "未查询到当前用户",
        })
      }
    }
  })
});

module.exports = router;