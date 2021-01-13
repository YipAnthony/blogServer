var createError = require('http-errors');
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// User Authentication imports
const session = require("express-session")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const { passportAuthentication, serialize, deserialize } = require("./functions/passport")

// Flash messages
const flash = require("connect-flash")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var loginRouter = require('./routes/login');

// import models
const BlogPost = require('./models/blogPost')
const BlogComment = require('./models/blogComment')

require('dotenv').config()

var app = express();

passport.use(passportAuthentication)
passport.serializeUser(serialize)
passport.deserializeUser(deserialize)

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.DB_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.set('useFindAndModify', false);

// view engine setup
app.use(expressLayouts)
app.set('layout', './layouts/layout.ejs')
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(session({ secret: "cats", resave: true, saveUninitialized: true }));

// Passport Initialize
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// Connect flash
app.use(flash())

// Global Error/success variables
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("successMsg")
  res.locals.errorMsg = req.flash("errorMsg")
  res.locals.msg = req.flash("error")
  res.locals.user = req.user
  next();
})


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/login', loginRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
