const Post = require('../../../models/post');
const Comment = require('../../../models/comment');


module.exports.index = async function(req,res){
    let post = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path : 'comments',
        populate : {
            path : 'user'
        }
    });
    

    return res.json(200,{
        message : 'List of Posts',
        posts : post
    });
}


module.exports.destroy = async function(req,res){
    try{
        let post = await Post.findById(req.params.id);
        //.id is used instead of ._id so that it can be converted into string
        if(post.user == req.user.id){
            post.remove();
            await Comment.deleteMany({post : req.params.id});
            
            res.json(200,{
                message : 'Post and associated comments deleted successfully'
            });
        }
        else{
            return res.json(401,{
                message : "Unauthorized"
            })
        }
    }catch(err){
        console.log('*******',err);
        res.json(500,{
            message : 'internal server error'
        })
    }
   
}