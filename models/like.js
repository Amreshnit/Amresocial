const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId
    },
    //this defines object ID of liked object
    likeable : {
        type :  mongoose.Schema.ObjectId,
        required : true,
        refPath : 'onModel'
    }, //this defines the type of object ID whether on POst os comment
    onModel : {
        type : String,
        required : true,
        enum : ['Post','Comment']
    }
},{
    timestamps : true
});

const Like = mongoose.model('Like',likeSchema);
module.exports = Like;