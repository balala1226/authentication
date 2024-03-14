var express = require('express');
var router = express.Router();
const User = require("../models/user");
const userController = require("../controllers/userController");

//sign up
router.get("/sign-up", userController.sign_up_get);
router.post("/sign-up", userController.sign_up_post);

//log in
router.get("/log-in", userController.log_in_get);
router.post("/log-in", userController.log_in_post);

//log in
router.get("/log-out", userController.log_out_get);

module.exports = router;
