const express = require("express");

const router = express.Router();
const acount = require("./acount");
const user = require("./user");



router.use("/acount", acount);
router.use("/user", user);

module.exports = router;