var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;
var BlogPostSchema = new Schema({
  	title: {type: String, required: true},
  	content: {type: String, required: true},
    username: {type: String, required: true},
    creationTime: {type: Date}
});

//Export model
module.exports = mongoose.model('BlogPost', BlogPostSchema);