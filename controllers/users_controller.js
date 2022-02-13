const User = require('../models/user');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');

module.exports.profile = async function(req,res){

    try{
        let post = await Post.find({user: req.params.id})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user likes'
            }
        })
        .populate('likes');
        // console.log('---------->',post);
        
    
        let user = await User.find({});
    
        // let signInUserFriends;
        // if(req.user){
        //  signInUserFriends = await User.findById(req.user._id)
        //  .populate('friendship', 'name email avatar');
        // }

        let signInUserFriends = await User.find({ friendship: req.params.id }).populate('friendship', 'name email avatar');
    
        let signin_User = await User.findById(req.params.id);
    
        return res.render('user_profile',{
            title : "profile",
            profile_user : signin_User,
            posts : post,
            all_users : user,
            all_friends : signInUserFriends
        });


    }catch(err){
        console.log('ERROR',err);
        return;
    }
 
  
}

module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title : "Codeial : Sign Up"
    });
}

module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title : "Codeial : Sign In"
    });
}

module.exports.create = function(req,res){
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log('error in finding user for signup');
            return;
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                    console.log('error in creating user for signup');
                    return;
                }
                return res.redirect('/users/sign-in');
            });
        }
        else{
            return res.redirect('back');
        }
    });

}

module.exports.createSession = function(req,res){
    req.flash('success','logged in successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    // res.clearCookie('codeial');
    req.logout();
    req.flash('success','You have logged out');
    return res.redirect('/');
    // req.session.destroy(function (err) {
    //     res.redirect('/');
    //   });
}

module.exports.update = async function(req,res){
    // if(req.user.id==req.params.id){
    //     User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
    //         return res.redirect('back');
    //     });
    // }
    // else{
    //     res.status(401).send('unauthorized');
    // }

    try{
        if(req.user.id == req.params.id){
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('******Multer Error',err);
                }
                user.name = req.body.name;
    
                if(req.file){
                    //this condition after && is added so that it don't give error for first upload as it doesn't find any pic to delete
                    if(user.avatar && fs.existsSync(path.join(__dirname , '..' , user.avatar))){  
                        fs.unlinkSync(path.join(__dirname , '..' , user.avatar));
                    }
                    
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                    console.log(req.file);
                }
                user.save();
                req.flash('success','Profile Pic uploaded');
                return res.redirect('back');
            });
        }
        else{
            req.flash('error','unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }

}