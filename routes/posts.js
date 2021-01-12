var express = require('express');
var router = express.Router();

const BlogPost = require('../models/blogPost')
const BlogComment = require('../models/blogComment')

// PUT: get edit post
router.get('/edit/:id', async (req, res, next) => {
    const blog = await BlogPost.findById(req.params.id)
    res.render('./layouts/updatePost', {blog, title: "Update Post"})
})

router.post('/edit/:id', async (req, res, next) => {
    BlogPost.findByIdAndUpdate(req.params.id, 
        {
            title: req.body.title,
            content: req.body.content,
            published: req.body.published,
            creationTime: new Date()
        },
        (err, blog) => {
            if (err) return next(err)
            req.flash('successMsg', "Post updated!")
            res.redirect('/')
        })
})

// Delete: delete post
router.get('/delete/:id', (req, res, next) => {
    BlogPost.findByIdAndRemove(req.params.id, (err) => {
        if (err) return next(err)
        req.flash('successMsg', "Post deleted!")
        res.redirect('/')
    })
})

// GET saved posts page
router.get('/saved', (req, res, next) => {
    BlogPost.find({username: req.user.username, published: false}, (err, blogs) => {
        if (err) return next(err)
        res.render('./layouts/unpublishedPosts', {blogs})
    })
})

// GET individual post
router.get('/:id', (req, res, next) => {
    BlogPost.findById(req.params.id, (err, blog) => {
        if (err) return next (err)
        res.render('./layouts/singleBlog', {blog})
    })
})

// POST post comment
router.post('/:id/comments', async (req, res, next) => {
    const blog = await BlogPost.findById(req.params.id).exec();
    const comments = blog.comments

    const newComment = new BlogComment({
        username: req.user.username,
        content: req.body.content,
        creationTime: new Date()
    })

    comments.push(newComment)

    BlogPost.findByIdAndUpdate(req.params.id, {comments}, (err, blog) => {
        if (err) return next(err)
        res.redirect(`/posts/${req.params.id}`)
    })
})

/* GET create posts page. */
router.get('/', function(req, res, next) {
  res.render('./layouts/posts', { title: "Create Post" });
});

/* POST create posts page. */
router.post('/', function(req, res, next) {


    const newBlogPost = new BlogPost({
        title: req.body.title,
        content: req.body.content,
        comments: [],
        username: req.user.username,
        published: req.body.published,
        creationTime: new Date()
    })

    newBlogPost.save( (err, post) => {
        if (err) return next(err)
        console.log(`Post ${post.title} Added to DB`)
        res.redirect('../')
    })
});


router.get('/saved', (req, res, next) => {
  
})


module.exports = router;
