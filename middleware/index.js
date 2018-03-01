const Book 		= require("../models/book"),
			Comment = require("../models/comment");

var middlewareObj = {
	isLoggedIn: function (req, res, next) {
		//if logged in, move on
		if (req.isAuthenticated()) {
			return next();
		}
		//if not logged in
		req.flash("error", "You need to be logged in to do that.")
		// req.session.redirectTo = req.originalUrl;
		res.redirect('/login');
	},
	checkBookOwnership: function (req, res, next) {
		//is user logged in?
		if(req.isAuthenticated()) {
			//does the book belong to the user?
			Book.findById(req.params.id, function(err, foundBook) {
				if (err) {
					console.log(err);
					res.redirect('back');
				} else {
					if (foundBook.owner.id.equals(req.user._id)) {
						next();
					} else {
						console.log("no permission to edit book");
						res.redirect('back');
					}
				}
			});
		}
	},
	checkCommentOwnership: function (req, res, next) {
			//is user logged in
			if(req.isAuthenticated()) {
				Comment.findById(req.params.comment_id, function(err, foundComment) {
					if (err) {
						console.log(err);
						res.redirect('back');
					} else {
						if (foundComment.owner.id.equals(req.user._id)) {
							next();
						} else {
							console.log('no permission to edit comment');
							res.redirect('back');
						}
					}
				});
			};
	}
};

module.exports = middlewareObj;
