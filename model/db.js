const mongoose = require("mongoose");
const log4js = require('log4js');
const path = require('path');
const log = log4js.getLogger(path.basename(__filename));
const config = require("../config");

mongoose.connect(config.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, }, (err) => {
  if (err) {
    log.error('数据库链接失败', err);
    return;
  }
  log.info("数据库链接成功");
});


module.exports = mongoose;