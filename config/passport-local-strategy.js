const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({
        usernameField : 'email',
        passReqToCallback : true
    },
    function(req,email,password,done){
        User.findOne({email:email},function(err,user){
            if(err){
                req.flash('error',err);
                return done(err);
            }

            if(!user || user.password!=password){
               req.flash('error','Invalid username/password');
                return done(null,false);
            }

            return done(null,user);
        });
    }

));


//serializing the user to know which key is present in cookie
passport.serializeUser(function(user,done){
    done(null,user.id);
})


//deserializing the user from the key in cookie
passport.deserializeUser(function(id,done){

    User.findById(id,function(err,user){
        if(err){
            console.log('error in finding user--->deserialize');
            return done(err);
        }
        return done(null,user);
    });

});

passport.checkAuthentication = function(req,res,next){  //add this in routes
    //if user is signed in then pass the requset to next function(controller)
    if(req.isAuthenticated()){
        return next();
    }
    //if not signed in then redirect to sign-in page
    return res.redirect('/users/sign-in');
}

//add this in index.js
passport.setAuthenticatedUser = function(req,res,next){  
    //storing value in locals so that it can be used in ejs
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }

    next();
}


module.exports = passport;