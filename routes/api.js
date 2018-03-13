const express 		= require("express"),
			router 			= express.Router(),
			Book 				= require("../models/book"),
			Comment 		= require("../models/comment");

//prefix "/books/api"

router.get("/", (req, res) => {
	Book.find()
	.then((books) => {
		res.json(books);
	})
	.catch((err) => {
		res.send(err);
	})
});

router.get("/browse_category/:genre", (req, res) => {
	Book.find({ genre: req.params.genre})
	.then((books) => {
		res.json(books);
	})
	.catch((err) => {
		res.send(err);
	});
});

/*========= SEARCH ============*/
//search on index page
router.get('/search', (req, res) => {
	var val = req.query.search;
	console.log(val);

	Book.find({
		$text: {
			$search: val,
		}
})
	.then((books) => {
		console.log(books);
		res.json(books);
	})
	.catch((err) => {
		console.log(err);
	})
});

module.exports = router;
