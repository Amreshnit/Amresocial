const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
const fs = require('fs');
const path = require('path');

module.exports.create = async function(req,res){
    try{
        let post = await Post.create({
            content : req.body.content,
            user  : req.user._id
        });

       

        console.log(post);
        if(req.xhr){
            post = await Post.findById(post._id).populate('user');
            return res.status(200).json({
                data : {
                    post : post
                },
                message : 'Post created'
            });
        }
        req.flash('success','Post Created');
        return res.redirect('back');

    }catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }
}


module.exports.upload = async function(req,res){

    try{

        await Post.uploadedImage(req,res, async function(err){
            if(err){ 
                console.log('***Multer error', err); 
                return;
            }

            let mainPath = path.join(Post.imagePath,'/',req.file.filename);

           let post = await Post.create({
               user : req.user._id,
               postImage : mainPath
           });

           req.flash('success', 'Post created successfully');
           return res.redirect('back');
        })

    }catch(err){
        req.flash('error',err);
        console.log('image ulpoad error',err);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req,res){
    try{
        let post = await Post.findById(req.params.id);
        //.id is used instead of ._id so that it can be converted into string
        if(post.user == req.user.id){

            if(post.postImage){
                fs.unlinkSync(path.join(__dirname,'..',post.postImage));
            }


            //removing likes associated with the posts
            await Like.deleteMany({likeable : post._id, onModel : 'Post'});
            await Like.deleteMany({likeable : {$in : post.comments}});

            post.remove();
            await Comment.deleteMany({post : req.params.id});
            
            if(req.xhr){
                return res.status(200).json({
                    data : {
                        post_id : req.params.id
                    },
                    message : "Post Deleted"
                });
            }
            req.flash('success','Post and All associated comments deleted');
            return res.redirect('back');
        }
        else{
            req.flash('error','Not authorized to delete this post');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }
   
}