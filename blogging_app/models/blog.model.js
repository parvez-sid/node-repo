const {model, Schema} = require('mongoose');

const blogSchema = new Schema({
    title : { type : String, required : true },
    body : { type : String, required : true },
    coverImgURL : { type : String, default : "/images.defaultAvatar.png" },
    createdBy : { type : Schema.Types.ObjectId, ref: 'user' }
}, 
    {timestamps : {createdAt : 'created_at', updatedAt: 'updated_at'}
});

const Blog = model('blog', blogSchema);

module.exports = Blog;
