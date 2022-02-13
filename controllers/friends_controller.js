const User = require('../models/user');
const Friendship = require('../models/friendship');

module.exports.create = async function(req,res){
    try{
        
        let fromUser = await User.findById(req.user._id);
        let toUser = await User.findById(req.query.toid);

        // let friend = await Friendship.create({
        //     to_user : req.query.toid,
        //     from_user : req.user._id
        // })

        if(!fromUser.friendship.includes(req.query.toid)){
            fromUser.friendship.push(req.query.toid);
            fromUser.save();
            toUser.friendship.push(req.user._id);
            toUser.save();
            req.flash('success','Friend Created');
        }else{
            req.flash('error','Friend Already Exists');
        }
        return res.redirect('back');


    }catch(err){
        console.log("Error in creating friends", err);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req,res){
    try{
        
        let fromUser = await User.findById(req.user._id);
        let toUser = await User.findById(req.query.toid);

        await User.findByIdAndUpdate(fromUser,{$pull : {friendship : req.query.toid}});
        await User.findByIdAndUpdate(toUser,{$pull : {friendship : req.user._id}});

        req.flash('success','Friend deleted');
        return res.redirect('back');

    }catch(err){
        console.log("Error in creating friends", err);
        return res.redirect('back');
    }
}