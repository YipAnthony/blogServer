var express = require('express');
var router = express.Router();
const passport = require("passport")

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('./layouts/login', { title: "Log in" , errors: []});
});

// POST login
router.post('/', 
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    })
)

module.exports = router;
