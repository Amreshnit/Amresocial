const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');
// const { route } = require('./users');

console.log('router loaded');

router.get('/',homeController.home);
router.use('/users',require('./users'));
router.use('/posts',require('./posts'));
router.use('/comments',require('./comments'));
router.use('/likes',require('./likes'));
router.use('/friends',require('./friends'));
router.use('/messages',require('./messages'));


router.use('/api',require('./api'));
module.exports = router;