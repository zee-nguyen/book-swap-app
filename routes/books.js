const express 		= require("express"),
			router 			= express.Router(),
			Book 				= require("../models/book"),
			middleware	= require("../middleware");

//Display all books for swap
router.get('/', (req, res) => {
	//get all books from db
	Book.find({})
	.then((allBooks) => {
		res.render('books/books', {books: allBooks});
	})
	.catch((err) => {
		console.log(err);
	});
});

//NEW - get form to create new book
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('books/new');
});

//CREATE - post new book to db
router.post('/', middleware.isLoggedIn, (req, res) => {
	var newBook = req.body.book;
	newBook.owner = {
		id: req.user._id,
		username: req.user.username
	};
	Book.create(newBook)
	.then((newBook) => {
		console.log('new book created!');
		res.redirect('/books/'+ newBook._id);
	})
	.catch((err) => {
		console.log(err);
	});
});

//SHOW - get detail of each book to show
router.get('/:id', (req, res) => {
	//look up book by id
	Book.findById(req.params.id)
	.populate('comments')
	.exec((err, foundBook) => {
		if (err) {
			console.log(err);
		} else {
			//render show page
			res.render("books/show", {book: foundBook});
		}
	});
});

//EDIT - get edit form
router.get('/:id/edit', middleware.checkBookOwnership, (req, res) => {
	//find book by ID and send data along to edit form
	Book.findById(req.params.id)
	.then((foundBook) => {
		res.render('books/edit', {book: foundBook});
	})
	.catch((err) => {
		req.flash("Sorry, you don't have permission to do that");
		console.log(err);
	});
});

//UPDATE - put edit info into database
router.put('/:id', middleware.checkBookOwnership, (req, res) => {
	//look up book by id and update
	Book.findByIdAndUpdate(req.params.id, req.body.book)
	.then((updatedBook) => {
		res.redirect('/books/' + req.params.id);
	})
	.catch((err) => {
		console.log(err);
		res.redirect('/books');
	});
});

//DELETE - delete book
router.delete('/:id', middleware.checkBookOwnership, (req, res) => {
	//look up by id and delete
	Book.findByIdAndRemove(req.params.id)
	.then((removedBook) => {
		console.log('book removed!');
		res.redirect('/books');
	})
	.catch((err) => {
		console.log(err);
	});
});


/* ======== BOOK SEARCH ========== */
router.post("/search", (req, res) => {
  var query = req.body.query;
  Book.find({
    $text: {
      $search: query
    }
  })
    .then(books => {
      res.render("books/search-result", {books: books, keyword: query});
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
