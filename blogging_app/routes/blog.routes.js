const router = require('express').Router();
const multer  = require('multer');

const Blog = require("../models/blog.model");
const Comment = require("../models/comment.model");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        const fileName = file.fieldname + "-" + Date.now() + "-" + file.originalname
        cb(null, fileName)
    }
})
  
const upload = multer({ storage: storage });

// render add blog page
router.get('/add', (req, res) => {
    return res.render('addBlog', {
        user: JSON.stringify(req.user),
        name: req.user?.fullName
    })
})

// api show a blog
router.get("/:id", async (req, res) => {
    const { id } = req.params
    const blog = await Blog.findById(id).populate("createdBy", { fullName : 1, profileImgURL: 1 });
    const comments = await Comment.find({ blogId: id }).sort({created_at : -1}).populate("commentedBy",  { fullName : 1, profileImgURL: 1 });
    
    return res.render('blog', {
        user: req.user,
        name: req.user?.fullName,
        blog,
        comments
    })
})

router.post('/', (req, res) => {
    const uploadFile = upload.single('coverImage');
    uploadFile(req, res, async function (err) {
        if (err) { return res.json({status_message : 'Error to upload files.'} ) };

        const { title, body } = req.body;
        const newBlog = new Blog({
            title,
            body,
            createdBy: req.user._id,
            coverImgURL: (req.file ? req.file.path : null)
        });
        const blog = await newBlog.save();
        if(!blog) return res.json({ error : "Blog not created"});
        res.redirect(`/blogs/${blog._id}`);
    })
});

// Comment on he blog
router.post("/comment/:blogId", async(req, res) => {
    const { content } = req.body;
    const newComment = new Comment({
        content,
        commentedBy: req.user._id,
        blogId: req.params.blogId
    });
    const comment = await newComment.save();
    if(!comment) return res.json({ error : "Comment not posted"});
    res.redirect(`/blogs/${req.params.blogId}`);
})
module.exports = router;