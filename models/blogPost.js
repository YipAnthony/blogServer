var mongoose = require('mongoose');
const BlogComment = require('./blogComment');
const BlogCommentSchema = new BlogComment
const moment = require('moment')

//Define a schema
var Schema = mongoose.Schema;
var BlogPostSchema = new Schema({
  	title: {type: String, required: true},
	content: {type: String, required: true},
  	comments: {type: Array},
	username: {type: String, required: true},
	published: {type: Boolean, required: true},
    creationTime: {type: Date}
});

// Virtual for formatted date
BlogPostSchema.virtual('formattedCreationTime').get(function() {
	return moment(this.creationTime).format('MMM Do YYYY, h:mm')
})

//Export model
module.exports = mongoose.model('BlogPost', BlogPostSchema);