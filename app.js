var express = require("express"),
		app = express(),
		mongoose = require("mongoose"),
		passport = require("passport"),
		LocalStrategy = require("passport-local"),
		passportLocalMongoose = require("passport-local-mongoose"),
		// session = require("express-session"),
		bodyParser = require("body-parser"),
		methodOverride = require("method-override"),
		favicon = require("serve-favicon"),
		flash = require("flash"),
		Book = require("./models/book"),
		User = require("./models/user"),
		seedDB = require("./seeds");

//Setup Mongoose connection
var dev_db_url = 'mongodb://admin:123adminbookswap123@ds041678.mlab.com:41678/book-swap';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(favicon(__dirname + '/public/images/favicon.png'));
// app.use(flash());

// seedDB();

// Passport configuration
app.use(require("express-session")({
    secret: "It's snowing today",
    resave: false,
    saveUninitialized: false
}));

// Passport Config
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//custom middleware
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});



//Landing page
app.get('/', function(req, res) {
	res.render('index');
});

//Display all books for swap
app.get('/books', function(req, res) {
	//get all books from db
	Book.find({})
	.then(function(allBooks) {
		res.render('books/books', {books: allBooks});
	})
	.catch(function(err) {
		console.log(err);
	})
});

//NEW - get form to create new book
app.get('/books/new', function(req, res) {
	res.render('books/new');
})

//CREATE - post new book to db
app.post('/books', function(req, res) {
	Book.create(req.body.book)
	.then(function(newBook) {
		console.log('new book created!');
		console.log(newBook);
		res.redirect('/books');
	})
	.catch(function(err) {
		console.log(err);
	})
});

//SHOW - get detail of each book to show
app.get('/books/:id', function(req, res) {
	//look up book by id
	Book.findById(req.params.id)
	.populate('comments')
	.exec(function(err, foundBook) {
		if (err) {
			console.log(err);
		} else {
			//render show page
			res.render("books/show", {book: foundBook});
		}
	});
});

//EDIT - get edit form
app.get('/books/:id/edit', function(req, res) {
	//find book by ID and send data along to edit form
	Book.findById(req.params.id)
	.then(function(foundBook) {
		res.render('books/edit', {book: foundBook});
	})
	.catch(function(err) {
		console.log(err);
	});
});

//UPDATE - put edit info into database
app.put('/books/:id', function(req, res) {
	//look up book by id and update
	Book.findByIdAndUpdate(req.params.id, req.body.book)
	.then(function(updatedBook) {
		res.redirect('/books/' + req.params.id);
	})
	.catch(function(err) {
		console.log(err);
		res.redirect('/books');
	})
});

//DELETE - delete book
app.delete('/books/:id', function(req, res) {
	//look up by id and delete
	Book.findByIdAndRemove(req.params.id)
	.then(function(removedBook) {
		console.log('book removed!');
		res.redirect('/books');
	})
	.catch(function(err) {
		console.log(err);
	})
});

/* ==========USER LOGIC===============*/
//GET register form
app.get('/register', function(req, res) {
	res.render('register');
});

//Handle user sign up
app.post('/register', function(req, res) {
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
app.get('/login', function(req, res) {
	res.render('login');
});

//Handle user login
app.post('/login', function(req, res, next) {
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
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

/* ==========COMMENTS LOGIC===============*/

//GET - comment form
app.get('/books/:id/comments/new', function(req, res) {
	//find book by id
	Book.findById(req.params.id)
		.then(function(foundBook) {
			res.render('comments/new', {book: foundBook});
		})
		.catch(function(err) {
			if(err) {
				console.log(err);
				res.redirect("/books");
			}
		});
});

//CREATE - new comment
app.post('/books/:id/comments', function(req, res) {
	Book.findById(req.params.id)
		.then(function(book) {
			Comment.create(req.body.comment)
				.then(function(comment) {
					//associate comment with username and id
					comment.owner.id = req.user._id;
					comment.owner.username = req.user.username;
					//save comment and push to book
					comment.save();
					book.comments.push(comment);
					//save book and redirect
					book.save();
					res.redirect('/books/' + book._id)
				})
				.catch(function(err) {
					if(err) {
						console.log(err);
						res.redirect('/books');
					}
				})
		})
		.catch(function(err) {
			if(err) {
				console.log(err);
				res.redirect('/books');
			}
		});
});

//EDIT comment
app.get('/books/:id/comments/:comment_id/edit', function(req, res) {
	Comment.findById(req.params.comment_id)
		.then(function(comment) {
			res.render('comments/edit', {book_id: req.params.id, comment: comment});
		})
		.catch(function(err) {
			console.log(err);
			res.redirect('back');
		});
});

//UPDATE comment
app.put('/books/:id/comments/:comment_id', function(req, res) {
	//find comment and update
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
		.then(function(updatedComment) {
			res.redirect('/books/' + req.params.id)
		})
		.catch(function(err) {
			console.log(err);
			res.redirect('back');
		});
});

//DELETE COMMENT
app.delete('/books/:id/comments/:comment_id', function(req, res) {
	//find comment by ID and delete
	Comment.findByIdAndRemove(req.params.comment_id)
		.then(function(comment) {
			res.redirect('/books/' + req.params.id);
		})
		.catch(function(err) {
			console.log(err);
			res.redirect('back');
		})
})
// //isLoggedIn Middleware
// function isLoggedIn(req, res, next) {
// 	//if logged in, move on
// 	if (req.isAuthenticated()) {
// 		return next();
// 	}
// 	//if not logged in
// 	req.flash('error', 'You need to be logged in to do that.');
// 	req.session.redirectTo = req.originalUrl;
// 	res.redirect('/login');
// }



app.listen('8888', () => console.log('magic seriously is happening on port 8888'));
