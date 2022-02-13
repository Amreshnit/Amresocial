const express = require('express');
const router = express.Router();
const passport = require('passport');

const messagesController = require('../controllers/messages_controller');

router.get('/chats',passport.checkAuthentication,messagesController.userChats);
router.get('/chatroom',passport.checkAuthentication,messagesController.chatRoom);

module.exports = router;