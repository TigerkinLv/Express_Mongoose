const e = require("express");
const express = require("express");
const router = express.Router();
const md5 = require("md5");
const UserModel = require("../../model/user");

router.post("/register.do", (req, res) => {
  const { uname, upwd, phone, age, sex } = req.body;
  console.log(req.body);
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
// router.post("logOff.do", (req, res) => {

// });

module.exports = router;