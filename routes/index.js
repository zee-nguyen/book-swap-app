const express 		= require("express"),
			router 			= express.Router(),
			User 				= require("../models/user"),
			Book 				= require("../models/book"),
			passport    = require("passport"),
			middleware	= require("../middleware");

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
	var newUser = new User({username: req.body.username, fullname: req.body.fullname, avatar: "https://c1.staticflickr.com/5/4743/38784575450_a095a729a8.jpg", desc: "Just a bookworm in this vast universe."});
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

/*=========USER PROFILE ROUTE============*/
//Display user profile
router.get('/user/:username', middleware.isLoggedIn, function(req, res) {
	User.find({username: req.params.username})
	.then(function(user) {
		Book.find({'owner.username': user[0].username}, function(err, books) {
			res.render('user/profile', {books: books});
		});
	})
	.catch(function(err) {
		console.log(err);
	})
});

module.exports = router;
