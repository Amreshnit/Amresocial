const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

//creating passport strategy
passport.use(new googleStrategy({
    clientID : env.google_client_id,
    clientSecret : env.google_client_secret,
    callbackURL : env.google_call_back_url
},
    function(accessToken, refreshToken, profile, done){
        User.findOne({email : profile.emails[0].value}).exec(function(err,user){
            if(err){
                console.log('error in passport-google-oauth',err);
                return;
            }
            console.log(profile);

            //if user exist
            if(user){
                return done(null,user);
            }else{    //if not then create one
                User.create({
                    name : profile.displayName,
                    email : profile.emails[0].value,
                    password : crypto.randomBytes(20).toString('hex')
                }, function(err,user){
                    if(err){
                        console.log('error in passport-google-oauth',err);
                        return;
                    }
                    return done(null,user);
                });
            }
        });
    }
))

module.exports = passport;