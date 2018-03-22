const express 		= require("express"),
			router 			= express.Router(),
			User 				= require("../models/user"),
			Book 				= require("../models/book"),
			passport    = require("passport"),
			middleware	= require("../middleware");

//Landing page
router.get('/', (req, res) => {
	res.render('index');
});

/* ==========USER LOGIC===============*/
//GET register form
router.get('/register', (req, res) => {
	res.render('register', { success: req.session.success, errors: req.session.errors });
	req.session.errors = null;
});

//Handle user sign up
router.post('/register', function(req, res) {
	var newUser = new User({
    username: req.body.username,
    fullname: req.body.fullname,
    avatar: "https://c1.staticflickr.com/5/4743/38784575450_a095a729a8.jpg",
    desc: "Just a bookworm in this vast universe."
  });
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Welcome aboard! You're all signed up.");
			res.redirect('/books');
		})
	})
});


//GET login form
router.get('/login', (req, res) => {
	res.render('login');
});

//Handle user login
router.post('/login', (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) return next(err);
		if (!user) return res.redirect('/login');
		req.login(user, (err) => {
			if (err) return next(err);
			var redirectTo = req.session.redirectTo ? req.session.redirectTo : "/books";
			delete req.session.redirectTo;

			req.flash("success", `Welcome back, ${user.username}!`);
			res.redirect(redirectTo);
			// return res.redirect("/books");
		})
	})(req, res, next);
});

//Logout
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Logged out successfully. See you again soon!')
	res.redirect('/');
});

/*=========USER PROFILE ROUTE============*/
//Display user profile
router.get('/user/:username', middleware.isLoggedIn, (req, res) => {
	User.find({username: req.params.username})
	.then((user) => {
		Book.find({'owner.username': user[0].username}, (err, books) => {
			if (err) console.log(err);
			res.render('user/profile', {books: books});
		});
	})
	.catch((err) => {
		console.log(err);
	})
});


module.exports = router;
