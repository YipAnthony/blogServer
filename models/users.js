var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  	first_name: {type: String, required: true, maxlength: 100},
    last_name: {type: String, required: true, maxlength: 100},
    username: {type: String, required: true, maxlength: 100},
    password: {type: String, required: true}
});

//Export model
module.exports = mongoose.model('User', UserSchema);