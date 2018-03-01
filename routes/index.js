const express 		= require("express"),
			router 			= express.Router(),
			User 				= require("../models/user"),
			passport    = require("passport");

//Landing page
router.get('/', function(req, res) {
	res.render('index');
});

/* ==========USER LOGIC===============*/
//GET register form
router.get('/register', function(req, res) {
	res.render('register');
});

//Handle user sign up
router.post('/register', function(req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
		}
		passport.authenticate("local")(req, res, function() {
			console.log(user);
			res.redirect('/books');
		})
	})
});


//GET login form
router.get('/login', function(req, res) {
	res.render('login');
});

//Handle user login
router.post('/login', function(req, res, next) {
	passport.authenticate("local", function(err, user, info) {
		if (err) { return next(err); }
		if (!user) { return res.redirect('/login'); }
		req.login(user, function(err) {
			if (err) { return next(err); }
			// var redirectTo = req.session.redirectTo ? req.session.redirectTo : "/books";
			// delete req.session.redirectTo;
			// res.redirect(redirectTo);
			return res.redirect("/books");
		})
	})(req, res, next);
});

//Logout
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;
