const Post = require('../models/post');
const User = require('../models/user');
const friendship = require('../models/friendship');

module.exports.home = async function(req,res){
    try{

        let post = await Post.find({})
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

        let signInUserFriends;
        if(req.user){
         signInUserFriends = await User.findById(req.user._id)
         .populate('friendship', 'name email avatar');
        }


       
        return res.render('home',{
            title:"SocialArray home",
            posts : post,
            all_users : user,
            all_friends : signInUserFriends
        });
    }catch(err){
        console.log('ERROR',err);
        return;
    }
                
}


//------------------------------------------------------promises method-----------------------------------------------------------------

// module.exports.home = function(req,res){

//     try{
//         let post = Post.find({})
//         .populate('user')
//         .populate({
//             path : 'comments',
//             populate : {
//                 path : 'user'
//             }
//         }).exec();
    
//         let user = post.then(User.find({}));

//         user.then(function(){
//             return res.render('home',{
//                 title:"codeial home",
//                 posts : post,
//                 all_users : user
//             });
//         });
       
//     }catch(err){
//         console.log('ERROR',err);
//          return;
//     }
   
// }

//------------------------------------simple method-------------------------------------------------------------------------

// module.exports.home = function(req,res){

//     Post.find({})
//     .populate('user')
//     .populate({
//         path : 'comments',
//         populate : {
//             path : 'user'
//         }
//     })
//     .exec(function(err,post){
//         if(err){
//                     console.log('error in fetching');
//                     return;
//                 }

                // User.find({},function(err,user){
                //     return res.render('home',{
                //         title:"codeial home",
                //         posts : post,
                //         all_users : user
                //     });
                // })
                
//     })
// }
