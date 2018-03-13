const express 		= require("express"),
			router 			= express.Router({mergeParams: true}),
			Book 				= require("../models/book"),
			Comment 		= require("../models/comment"),
			middleware	= require("../middleware");

//GET - comment form
router.get('/new', middleware.isLoggedIn, (req, res) => {
	//find book by id
	Book.findById(req.params.id)
		.then((foundBook) => {
			res.render('comments/new', {book: foundBook});
		})
		.catch((err) => {
			if(err) {
				console.log(err);
				res.redirect("/books");
			}
		});
});

//CREATE - new comment
router.post('/', middleware.isLoggedIn, (req, res) => {
	Book.findById(req.params.id)
		.then((book) => {
			Comment.create(req.body.comment)
				.then((comment) => {
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
				.catch((err) => {
					if(err) {
						console.log(err);
						res.redirect('/books');
					}
				})
		})
		.catch((err) => {
			if(err) {
				console.log(err);
				res.redirect('/books');
			}
		});
});

//EDIT comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id)
		.then((comment) => {
			res.render('comments/edit', {book_id: req.params.id, comment: comment});
		})
		.catch((err) => {
			console.log(err);
			res.redirect('back');
		});
});

//UPDATE comment
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	//find comment and update
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
		.then((updatedComment) => {
			res.redirect('/books/' + req.params.id)
		})
		.catch((err) => {
			console.log(err);
			res.redirect('back');
		});
});

//DELETE COMMENT
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	//find comment by ID and delete
	Comment.findByIdAndRemove(req.params.comment_id)
		.then((comment) => {
			req.flash('success', 'Comment deleted.');
			res.redirect('/books/' + req.params.id);
		})
		.catch((err) => {
			console.log(err);
			res.redirect('back');
		})
});

module.exports = router;
