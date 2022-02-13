const passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

//creating passport strategy
passport.use(new GitHubStrategy({
    clientID : "0c91aaefe63af46fe449",
    clientSecret : "4112e0aaab12b01a845aede3901e3f70dd2861d5",
    callbackURL :  env.github_call_back_url
},
    function(accessToken, refreshToken, profile, done){
        console.log("profile-github",profile);
        User.findOne({email : profile.username}).exec(function(err,user){
            if(err){
                console.log('error in passport-github-oauth',err);
                return;
            }
            console.log(profile);

            //if user exist
            if(user){
                return done(null,user);
            }else{    //if not then create one
                User.create({
                    name : profile.displayName,
                    email : profile.username,
                    password : crypto.randomBytes(20).toString('hex')
                }, function(err,user){
                    if(err){
                        console.log('error in passport-github-oauth',err);
                        return;
                    }
                    return done(null,user);
                });
            }
        });
    }
   
))

module.exports = passport;