const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const env = require('./environment');

let opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : env.jwt_secret
}

passport.use(new JwtStrategy(opts,function(jwtPayload,done){
    User.findById(jwtPayload._id, function(err, user){
        if(err){
            console.log('Error in Jwt');
            return
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));

module.exports = passport;