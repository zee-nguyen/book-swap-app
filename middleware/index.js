const Book = require("../models/book"),
  Comment = require("../models/comment");

var middlewareObj = {
  isLoggedIn: function(req, res, next) {
    //if logged in, move on
    if (req.isAuthenticated()) {
      return next();
    }
    //if not logged in
    req.flash("error", "You need to be logged in to do that.");
    req.session.redirectTo = req.originalUrl;
    res.redirect("/login");
  },
  checkBookOwnership: function(req, res, next) {
    //is user logged in?
    if (req.isAuthenticated()) {
      //does the book belong to the user?
      Book.findById(req.params.id, (err, foundBook) => {
        if (err) {
          req.flash(
            "error",
            "Oops! Something goes wrong. Please try again in a few minutes."
          );
          // console.log(err);
          res.redirect("back");
        } else {
          if (foundBook.owner.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "You don't have permission to do that.");
            res.redirect("back");
          }
        }
      });
    }
  },
  checkCommentOwnership: function(req, res, next) {
    //is user logged in
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
          req.flash(
            "error",
            "Oops! Something goes wrong. Please try again in a few minutes."
          );
          // console.log(err);
          res.redirect("back");
        } else {
          if (foundComment.owner.id.equals(req.user._id)) {
            next();
          } else {
            req.flash("error", "You don't have permission to do that.");
            res.redirect("back");
          }
        }
      });
    }
  }
};

module.exports = middlewareObj;
