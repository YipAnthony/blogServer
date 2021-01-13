var express = require('express');
var router = express.Router();

const BlogPost = require('../models/blogPost')

/* GET home page. */
router.get('/', async (req, res, next) => {

  const posts = await BlogPost.find({}).sort({creationTime: "desc"})
  
  res.render('index', { title: "Generic Blog", posts });
});

module.exports = router;
