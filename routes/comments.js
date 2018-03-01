const express 		= require("express"),
			router 			= express.Router({mergeParams: true}),
			Book 				= require("../models/book"),
			Comment 		= require("../models/comment"),
			middleware	= require("../middleware");

//GET - comment form
router.get('/new', middleware.isLoggedIn, function(req, res) {
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
router.post('/', middleware.isLoggedIn, function(req, res) {
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
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
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
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
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
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	//find comment by ID and delete
	Comment.findByIdAndRemove(req.params.comment_id)
		.then(function(comment) {
			res.redirect('/books/' + req.params.id);
		})
		.catch(function(err) {
			console.log(err);
			res.redirect('back');
		})
});

module.exports = router;
