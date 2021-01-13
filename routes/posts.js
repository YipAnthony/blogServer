var express = require('express');
var router = express.Router();

const BlogPost = require('../models/blogPost')
const BlogComment = require('../models/blogComment')
const moment = require('moment')
const checkLoggedIn = require('../functions/checkAuthorization')

// GET: get edit post
router.get('/edit/:id', checkLoggedIn, async (req, res, next) => {
    const blog = await BlogPost.findById(req.params.id)
    
    if (req.user.username != blog.username) {
        req.flash('errorMsg', "You cannot edit another user's post")
        res.redirect('/')
    }
    res.render('./layouts/updatePost', {blog, title: "Update Post"})
})

// POST: change post
router.post('/edit/:id', checkLoggedIn, async (req, res, next) => {

    const blog = await BlogPost.findById(req.params.id)
    
    if (req.user.username != blog.username) {
        req.flash('errorMsg', "You cannot edit another user's post")
        res.redirect('/')
    }

    BlogPost.findByIdAndUpdate(req.params.id, 
        {
            title: req.body.title,
            content: req.body.content,
            published: req.body.published,
            creationTime: new Date()
        },
        (err, blog) => {
            if (err) return next(err)
            if (req.body.published === "true") {
                req.flash('successMsg', "Post updated!")
            } else {
                req.flash('successMsg', "Post saved for later!")
            }
            res.redirect('/')
        })
})

// Delete: delete post
router.get('/delete/:id', checkLoggedIn, async (req, res, next) => {

    const blog = await BlogPost.findById(req.params.id)
    
    if (req.user.username != blog.username) {
        req.flash('errorMsg', "You cannot edit another user's post")
        res.redirect('/')
    }

    BlogPost.findByIdAndRemove(req.params.id, (err) => {
        if (err) return next(err)
        req.flash('successMsg', "Post deleted!")
        res.redirect('/')
    })
})

// GET saved posts page
router.get('/saved', checkLoggedIn, (req, res, next) => {
    BlogPost.find({username: req.user.username, published: false}, (err, blogs) => {
        if (err) return next(err)
        res.render('./layouts/unpublishedPosts', {blogs, title: "Unpublished Posts"})
    })
})

// GET individual post
router.get('/:id', (req, res, next) => {
    BlogPost.findById(req.params.id, (err, blog) => {
        if (err) return next (err)
        res.render('./layouts/singleBlog', {blog, title: "Generic Blog"})
    })
})

// Get delete comment
router.post('/:id/comments/delete/:commentid', checkLoggedIn, async (req, res, next) => {


    const blog = await BlogPost.findById(req.params.id).exec();
    const comments = blog.comments
    const selectedComment = comments.find(comment => {
        return comment._id == req.params.commentid
    })



    if (req.user.username != selectedComment.username) {
        req.flash('errorMsg', "You cannot edit another user's comment")
        res.redirect('/')
    }

    const newComments = comments.filter(comment => {
        return comment._id != req.params.commentid
    })

    BlogPost.findByIdAndUpdate(req.params.id, {comments: newComments}, (err, blog) => {
        if (err) return next(err)
        req.flash("successMsg", "Comment deleted!")
        res.redirect(`/posts/${req.params.id}`)
    })

})

// POST post comment
router.post('/:id/comments', checkLoggedIn, async (req, res, next) => {
    const blog = await BlogPost.findById(req.params.id).exec();
    const comments = blog.comments

    const newComment = new BlogComment({
        username: req.user.username,
        content: req.body.content,
        creationTime: new Date(),
        formattedCreationTime: moment().format('MMM Do YYYY, h:mm')
    })

    comments.push(newComment)

    BlogPost.findByIdAndUpdate(req.params.id, {comments}, (err, blog) => {
        if (err) return next(err)
        req.flash("successMsg", "Comment posted!")
        res.redirect(`/posts/${req.params.id}`)
    })

})

/* GET create posts page. */
router.get('/', checkLoggedIn, function(req, res, next) {
  res.render('./layouts/posts', { title: "Create Post" });
});

/* POST create posts page. */
router.post('/', checkLoggedIn, function(req, res, next) {


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


module.exports = router;
