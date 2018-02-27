var express = require('express'),
		app = express(),
		mongoose = require('mongoose')
		bodyParser = require('body-parser'),
		Book = require('./models/book'),
		seedDB = require('./seeds');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

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
	.populate("author")
	.populate("genre")
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
	//get data from form and add to book array
	// TODO - fix issue where input needs to convert to id for genre and author
	var book = req.body.book;
	Book.create(book)
	.then(function(newBook) {
		console.log("new book created!");
		res.redirect('/books');
	})
	.catch(function(err) {
		console.log(err);
	});
});

//SHOW - get detail of each book to show
app.get('/books/:id', function(req, res) {
	//look up book by id
	Book.findById(req.params.id)
	.populate('comments')
	.populate('author')
	.populate('genre')
	.exec(function(err, foundBook) {
		if (err) {
			console.log(err);
		} else {
			//render show page
			res.render("books/show", {book: foundBook});
		}
	});
});

//EDIT - edit book detail


app.listen('8888', () => console.log('magic seriously is happening on port 8888'));
