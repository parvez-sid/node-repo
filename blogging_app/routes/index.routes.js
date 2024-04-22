const router = require('express').Router();
const Blog = require('../models/blog.model');
const fs = require('fs');
const zlib = require('zlib');

// redering home with all blogs
router.get('/', async (req, res) => {
    const allBlogs = await Blog.find({sort: { "created_at" : -1 }});

    res.render('home', {
        user: JSON.stringify(req.user),
        name: req.user?.fullName,
        blogList : allBlogs,
    })
})


// reading text file
router.get("/read", (req, res) => {
    // fs.readFile("./uploads/samples/sample.pdf", (err, data) => {
    //     if(err) throw new Error;
    //     res.end(data)
    // })

    const stream = fs.createReadStream("./uploads/samples/sample.pdf");
    stream.on('data', (chunk) => res.write(chunk));
    stream.on('end', () => res.end());
})

// create zip file
router.get("/zip", (req, res) => {
    fs.createReadStream("./uploads/samples/sample.pdf")
    .pipe(zlib.createGzip().pipe(fs.createWriteStream("./uploads/samples/sample.zip")));
    res.json({ message: "Zip created"})
})

module.exports = router;