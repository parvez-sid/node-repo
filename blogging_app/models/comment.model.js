const {model, Schema} = require('mongoose');

const commentSchema = new Schema({
    content : { type : String, required : true },
    blogId : { type : Schema.Types.ObjectId, ref: 'blog' },
    commentedBy : { type : Schema.Types.ObjectId, ref: 'user' }
}, 
    {timestamps : {createdAt : 'created_at', updatedAt: 'updated_at'}
});

const Comment = model('comment', commentSchema);

module.exports = Comment;
