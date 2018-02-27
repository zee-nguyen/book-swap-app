var express = require('express'),
		app = express(),
		mongoose = require('mongoose')
		bodyParser = require('body-parser'),
		methodOverride = require('method-override'),
		Book = require('./models/book'),
		Genre = require('./models/genre'),
		seedDB = require('./seeds');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//Setup Mongoose connection
var dev_db_url = 'mongodb://admin:123adminbookswap123@ds041678.mlab.com:41678/book-swap';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// seedDB();

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


app.listen('8888', () => console.log('magic seriously is happening on port 8888'));
