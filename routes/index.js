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
router.post('/register', (req, res) => {
  req.checkBody("fullname")
    .notEmpty()
    .withMessage("Full name can't be empty");
// TODO: check validation bug
	req
    .checkBody("username", "Username can only include letters and numbers")
    .isAlpha()
    .custom(value => {
      User.findByUsername(req.body.username)
        .then(user => {
          throw new Error("This username is already in use");
        })
        .catch(err => {
          console.log(err);
        });
    });

  req
    .checkBody("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters");

	var errors = req.validationErrors();
	if (errors) {
		req.session.errors = errors;
		req.session.success = false;
	} else {
		req.session.success = true;

		var newUser = new User({
      username: req.body.username,
      fullname: req.body.fullname,
      avatar:
        "https://c1.staticflickr.com/5/4743/38784575450_a095a729a8.jpg",
      desc: "Just a bookworm in this vast universe."
    });

		User.register(newUser, req.body.password, (err, user) => {
			if (err) {
				req.flash("error", err);
				console.log(err);
			}
			passport.authenticate("local")(req, res, () => {
				req.flash("success", "Welcome abroad! You're all signed up!");
				res.redirect("/books");
			});
		});
	}
	res.redirect('/register');
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
