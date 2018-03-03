const express 		= require("express"),
			router 			= express.Router(),
			Book 				= require("../models/book"),
			Comment 		= require("../models/comment");

router.get("/", function(req, res) {
	Book.find()
	.then(function(books) {
		res.json(books);
	})
	.catch(function(err) {
		res.send(err);
	})
});

router.get("/browse_category/:genre", function(req, res) {
	Book.find({ genre: req.params.genre})
	.then(function(books) {
		res.json(books);
	})
	.catch(function(err) {
		res.send(err);
	});
});

router.get("/:query", function(req, res) {
	
})

module.exports = router;
