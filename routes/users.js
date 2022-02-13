const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/users_controller');

router.get('/profile/:id',passport.checkAuthentication,userController.profile);
router.post('/update/:id',passport.checkAuthentication,userController.update);
router.get('/sign-up',userController.signUp);
router.get('/sign-in',userController.signIn);
router.post('/create',userController.create);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'}
),userController.createSession);
router.get('/sign-out',userController.destroySession);

//google auth
router.get('/auth/google',passport.authenticate('google',{scope : ['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),userController.createSession);

//github auth
router.get('/auth/github',passport.authenticate('github',{scope : ['profile','email']}));
router.get('/auth/github/callback',passport.authenticate('github',{failureRedirect:'/users/sign-in'}),userController.createSession);

//facebook auth
router.get('/auth/facebook',passport.authenticate('facebook'));
router.get('/auth/facebook/callback',passport.authenticate('facebook',{failureRedirect:'/users/sign-in'}),userController.createSession);
module.exports = router;