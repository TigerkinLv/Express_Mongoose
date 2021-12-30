const mongoose = require("./db");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    require: [true, "用户名必传项"],
    minlength: [2, '用户名最小长度为2位'], // 最小长度
    maxlength: [10, '用户名最大长度为4位'], // 最大长度
  },
  pwd: {
    type: String,
    require: [true, "密码必传项"],
    trim: true,
    validate: {
      validator: (params) => {
        return params != "";
      },
      message: "密码不能为空"
    }
  },
  age: {
    type: Number,
    min: 0,  // 字段的最小值
    max: 180 // 最大值
  },
  phone: {
    type: String,
    match: /\d/,
    validate: (params) => {   //自定义验证器, 验证通过,true, 验证未通过 ,false
      if (params) {
        return params.length == 11;
      } else {
        return true;
      }
    }
  },
  sex: {
    type: Number,
    enum: [0, 1, 2], // 0男、1女、2未知
    default: 2
  },
  grade: {
    type: String,
    default: 0
  }
});

let UserModel = mongoose.model('User', UserSchema, "user");

module.exports = UserModel;