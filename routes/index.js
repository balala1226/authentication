var express = require('express');
var router = express.Router();

const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");

/* GET home page. */
router.get('/', messageController.index);

//sign up
router.get("/sign_up", userController.sign_up_get);
router.post("/sign_up", userController.sign_up_post);

//log in
router.get("/log_in", userController.log_in_get);
router.post("/log_in", userController.log_in_post);

//log out
router.get("/log_out", userController.log_out_get);

//membership
router.get("/membership", userController.membership_update_get);

//newMessage
router.post("/new_message", messageController.new_message_post);

//membershipUpdate
router.post("/premium_membership_update", userController.premium_membership_update_post);
router.post("/admin_membership_update", userController.admin_membership_update_post);

//delete message
router.post("/message_delete", messageController.message_delete_post);

module.exports = router;
