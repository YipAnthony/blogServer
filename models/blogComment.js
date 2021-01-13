var mongoose = require('mongoose');


//Define a schema
var Schema = mongoose.Schema;
var BlogCommentSchema = new Schema({
    username: {type: String},
    content: {type: String},
    creationTime: {type: Date},
    formattedCreationTime: {type: Schema.Types.Mixed}
});



//Export model
module.exports = mongoose.model('BlogComment', BlogCommentSchema);