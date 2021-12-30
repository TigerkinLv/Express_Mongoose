const express = require('express');
const ejs = require("ejs");
const session = require("express-session");
const MongoStore = require("connect-mongo");// session 分布式架构获取，将session保存在mongodb
const path = require("path");
const log4js = require('log4js');// 日志
const log4js_config = require('./config/log4js_config');
require('module-alias/register'); // 设置路径的别名

//接管console日志，自动区分类别
log4js.configure(log4js_config);
const loggerOfConsole = log4js.getLogger('console');
console.log = loggerOfConsole.info.bind(loggerOfConsole); // do the same for others - console.debug, etc.
console.debug = loggerOfConsole.info.bind(loggerOfConsole);


const config = require("./config")
const api = require("./routes/api");
const admin = require("./routes/admin");

const app = express()
const port = 3000

app.use(log4js.connectLogger(loggerOfConsole, { level: 'auto' }));
//app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
//log4js.replaceConsole(log4js.getLogger("db"));
const log = log4js.getLogger(path.basename(__filename));

// 配置模板引擎
app.engine("html", ejs.__express); // 配置支持html后缀模板
app.set("view engine", "ejs");

app.use(session({
  secret: "cms_lv", //服务端生成的session 签名
  name: "cms_lv",// 修改session 对应的cookie名称
  resave: true, // 强制保存session, 及时没有变化
  saveUninitialized: false, //  强制将未初始化的session存储
  cookie: {
    // httpOnly: true,
    secure: false, //设置为true，标识只有https 才能访问cookie ,从而访问session
    maxAge: 24 * 60 * 60 * 1000,
  },
  rolling: true,  //在每次请求时强制设置cookie, 这将重置cookie过期时间，（一直请求状态下）（默认值false）
  store: MongoStore.create({
    mongoUrl: config.dbUrl,
    touchAfter: 24 * 3600 // 不管发出了多少请求，在24小时内只更新一次session,除非改变了session
  })
}))
app.all('*', (req, res, next) => {
  const { origin, Origin, referer, Referer } = req.headers;
  const allowOrigin = origin || Origin || referer || Referer || '*';
  res.header("Access-Control-Allow-Origin", allowOrigin);
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); //可以带cookies
  res.header("X-Powered-By", 'Express');
  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 配置静态web目录
app.use(express.static("public"));
app.use("/views", express.static("views"));
app.use("/static", express.static("static"));
// 获取post 提交的数据
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



app.use("/admin", admin);
app.use("/api", api);


app.listen(port, () => log.info(`app is running on http://127.0.0.1:${port}`))