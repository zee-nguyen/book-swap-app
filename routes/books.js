const express 		= require("express"),
			router 			= express.Router(),
			Book 				= require("../models/book"),
			middleware	= require("../middleware");

//Display all books for swap
router.get('/', function(req, res) {
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
router.get('/new', middleware.isLoggedIn, function(req, res) {
	res.render('books/new');
})

//CREATE - post new book to db
router.post('/', middleware.isLoggedIn, function(req, res) {
	var newBook = req.body.book;
	newBook.owner = {
		id: req.user._id,
		username: req.user.username
	}
	Book.create(newBook)
	.then(function(newBook) {
		console.log('new book created!');
		res.redirect('/books/'+ newBook._id);
	})
	.catch(function(err) {
		console.log(err);
	})
});

//SHOW - get detail of each book to show
router.get('/:id', function(req, res) {
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
router.get('/:id/edit', middleware.checkBookOwnership, function(req, res) {
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
router.put('/:id', middleware.checkBookOwnership, function(req, res) {
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
router.delete('/:id', middleware.checkBookOwnership, function(req, res) {
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

module.exports = router;
