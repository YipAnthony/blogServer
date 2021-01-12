var express = require('express');
var router = express.Router();
const User = require('../models/users')
const bcrypt = require('bcryptjs')
const { body,validationResult } = require('express-validator');


// POST logout
router.post('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/')
})

/* GET users listing. */
router.get('/', function(req, res, next) { 
  res.render('./layouts/create-account', {title: "Create account", errors: [], fields: {}});
});

// POST to create user
router.post('/', [

  // Validate and sanitise fields
  body('username', 'Username is required').trim().isLength({min: 1}).escape(),
  body('firstName', 'First name is required').trim().isLength({min: 1}).escape(),
  body('lastName', 'Last name is required').trim().isLength({min: 1}).escape(),
  body('password', 'Password is required').trim().isLength({min: 1}).escape(),
  async(req, res, next) => {
    // Extract validation errors
    const errors = validationResult(req).array();

    const fieldsUnfilled = !req.body.firstName || !req.body.lastName|| !req.body.username|| !req.body.password|| !req.body.password2
    if (fieldsUnfilled) {
      // errors.push("Must fill out all fields")
      res.render('./layouts/create-account', 
        {
          title: "Create account", 
          errors,
          fields: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username
          }
        })
    } else {
      const usernameExists = await User.findOne({username: req.body.username}).exec()
      const passwordsMatch = req.body.password === req.body.password2
    
      if (usernameExists) {
        errors.push({msg: "Username already exists"})
      } 
      if (!passwordsMatch) {
        errors.push({msg: "Passwords do not match"})
      }
      if (!usernameExists & passwordsMatch) {
  
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
  
          if (err) return next(err)
  
          const newUser = new User({
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            username: req.body.username,
            password: hashedPassword
          })
      
          newUser.save( (err, user) => {
            if (err) return next(err)
            console.log(`Created ${user.username}`)
            req.flash('successMsg', "Account successfully created. Sign in to start blogging!")
            res.redirect('/')
          })
        })
  
      }
      else {
        res.render('./layouts/create-account', 
        {
          title: "Create account",
          errors,
          fields: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username
          }
        })
      }
    }

  }
])

module.exports = router;
