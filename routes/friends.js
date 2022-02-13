const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friends_controller');

router.get('/create',friendController.create);
router.get('/destroy',friendController.destroy);

module.exports = router;
